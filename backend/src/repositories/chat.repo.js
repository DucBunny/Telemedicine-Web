import { Op } from 'sequelize'
import Conversation from '@/models/nosql/conversation'
import Message from '@/models/nosql/message'
import { User } from '@/models/sql/index'
import { caseInsensitiveSearch } from '@/utils/search-case-insensitive'

/**
 * Kiểm tra user có trong conversation (1–1) hay không
 */
export const isConversationParticipant = async (userId, conversationId) => {
  const doc = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  })
    .select('_id')
    .lean()

  return !!doc
}

/**
 * userId là participant → trả về userId đối phương (1–1); không thì null
 */
export const getPeerUserIdIfParticipant = async (userId, conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  })
    .select('participants')
    .lean()

  if (!conversation) return null
  const peer = conversation.participants.find((id) => id !== userId)
  return peer != null ? Number(peer) : null
}

/**
 * Get all conversations for a user (cursor-based pagination)
 * Cursor dựa trên last_message.created_at để sắp xếp theo thời gian mới nhất
 */
export const getConversations = async (
  userId,
  { cursor, limit = 20, search },
) => {
  const normalizedSearch = search?.trim()

  let conversationQuery = { participants: userId }

  if (normalizedSearch) {
    const matchingUsers = await User.findAll({
      where: {
        id: { [Op.ne]: userId },
        [Op.or]: [caseInsensitiveSearch('full_name', normalizedSearch)],
      },
      attributes: ['id'],
    })

    const matchingUserIds = matchingUsers.map((user) => user.id)

    if (matchingUserIds.length === 0)
      return {
        data: [],
        meta: {
          nextCursor: null,
          hasMore: false,
          count: 0,
        },
      }

    conversationQuery = {
      $and: [
        { participants: userId },
        { participants: { $in: matchingUserIds } },
      ],
    }
  }

  const pagingResult = await Conversation.paginate({
    query: conversationQuery,
    limit,
    paginatedField: 'last_message.created_at',
    next: cursor,
    fields: {
      _id: 1,
      participants: 1,
      unread_counts: 1,
      'last_message.message_id': 1,
      'last_message.sender_id': 1,
      'last_message.type': 1,
      'last_message.content': 1,
      'last_message.created_at': 1,
    },
  })

  const conversations = pagingResult.results

  // Get other participants' IDs, filter undefined (in case of malformed data), and deduplicate
  const otherUserIds = [
    ...new Set(
      conversations
        .map((conv) => conv.participants.find((id) => id !== userId))
        .filter(Boolean),
    ),
  ]

  // If there are no conversations, we can skip the SQL query and return early
  if (otherUserIds.length === 0) {
    return {
      data: [],
      meta: {
        nextCursor: null,
        hasMore: false,
        count: 0,
      },
    }
  }

  // Get user details from SQL
  const users = await User.findAll({
    where: { id: otherUserIds },
    attributes: ['id', 'fullName', 'avatar'],
  })

  const userMap = {}
  users.forEach((user) => {
    userMap[user.id] = {
      id: user.id,
      fullName: user.fullName,
      avatar: user.avatar,
    }
  })

  // Format the response
  const data = conversations.map((conv) => {
    const otherUserId = conv.participants.find((id) => id !== userId)
    const unreadCounts = conv.unread_counts || {}
    const unreadCount =
      unreadCounts[userId.toString()] || unreadCounts[userId] || 0

    return {
      id: conv._id.toString(),
      user: userMap[otherUserId],
      lastMessage: conv.last_message
        ? {
            message: conv.last_message.content,
            createdAt: conv.last_message.created_at,
            type: conv.last_message.type,
          }
        : null,
      unreadCount,
    }
  })

  return {
    data,
    meta: {
      nextCursor: pagingResult?.next || null,
      hasMore: pagingResult?.hasNext || false,
      count: data.length,
    },
  }
}

/**
 * Get messages by conversationId (cursor-based pagination)
 */
export const getMessagesByConversationId = async (
  currentUserId,
  conversationId,
  { cursor, limit = 20 },
) => {
  // Find conversation and verify user is a participant
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: currentUserId,
  }).lean()

  if (!conversation) return null

  const pagingResult = await Message.paginate({
    query: { conversation_id: conversation._id },
    limit,
    next: cursor,
    fields: {
      _id: 1,
      sender_id: 1,
      type: 1,
      content: 1,
      status: 1,
      created_at: 1,
    },
  })

  const messages = pagingResult.results

  const otherUserId = conversation.participants.find(
    (id) => id !== currentUserId,
  )

  // Get user details from SQL
  const users = await User.findAll({
    where: { id: [currentUserId, otherUserId] },
    attributes: ['id', 'fullName', 'avatar'],
  })

  const currentUser = users.find((user) => user.id === currentUserId)
  const otherUser = users.find((user) => user.id === otherUserId)

  // Format messages with user details and reverse for chronological order
  const data = messages
    .map((msg) => ({
      id: msg._id.toString(),
      sender: msg.sender_id === currentUserId ? currentUser : otherUser,
      type: msg.type,
      content: msg.content,
      status: msg.status,
      createdAt: msg.created_at,
    }))
    .reverse()

  return {
    data,
    meta: {
      nextCursor: pagingResult?.next || null,
      hasMore: pagingResult?.hasNext || false,
      count: data.length,
    },
  }
}

/**
 * Get conversation detail by conversationId
 */
export const getConversationDetail = async (currentUserId, conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: currentUserId,
  }).lean()

  if (!conversation) return null

  const otherUserId = conversation.participants.find(
    (id) => id !== currentUserId,
  )

  const otherUser = await User.findByPk(otherUserId, {
    attributes: ['id', 'fullName', 'avatar'],
  })

  const unreadCounts = conversation.unread_counts || {}
  const unreadCount =
    unreadCounts[currentUserId.toString()] || unreadCounts[currentUserId] || 0

  return {
    id: conversation._id.toString(),
    participants: conversation.participants,
    user: otherUser || null,
    lastMessage: conversation.last_message
      ? {
          message: conversation.last_message.content,
          createdAt: conversation.last_message.created_at,
          type: conversation.last_message.type,
        }
      : null,
    unreadCount,
  }
}

/**
 * Send a message
 */
export const createMessage = async (data) => {
  const {
    senderId,
    conversationId,
    message,
    type = 'text',
    fileUrl,
    fileName,
    callId,
    callStatus,
    callDuration,
  } = data

  // Find or create conversation
  let conversation = await Conversation.findOne({
    _id: conversationId,
    participants: senderId,
  })

  if (!conversation) return null

  const otherUserId = conversation.participants.find((id) => id !== senderId)

  // Create message content based on type
  const messageContent = {}
  if (message) messageContent.text = message

  if (fileUrl) {
    messageContent.file_url = fileUrl
    if (fileName) {
      messageContent.file_name = fileName
    }
  }

  if (type === 'call') {
    messageContent.call_id = callId
    messageContent.call_status = callStatus
    if (callDuration != null) messageContent.call_duration = callDuration
  }

  // Create message
  const newMessage = await Message.create({
    conversation_id: conversationId,
    sender_id: senderId,
    type,
    content: messageContent,
    status: 'sent',
  })

  // Update conversation's last_message with appropriate content
  let lastMessageContent = message || ''
  if (type === 'image') {
    lastMessageContent = 'Đã gửi một ảnh'
  } else if (type === 'file') {
    lastMessageContent = `${fileName || 'Đã gửi file'}`
  } else if (type === 'call') {
    if (callStatus === 'rejected') {
      lastMessageContent = 'Cuộc gọi video - Từ chối'
    } else if (callStatus === 'missed') {
      lastMessageContent = 'Cuộc gọi video - Nhỡ máy'
    } else if (callStatus === 'completed') {
      lastMessageContent = 'Cuộc gọi video - Đã kết thúc'
    }
  }

  await Conversation.updateOne(
    { _id: conversationId },
    {
      $set: {
        last_message: {
          message_id: newMessage._id,
          sender_id: senderId,
          type: newMessage.type,
          content: lastMessageContent,
          created_at: newMessage.created_at,
        },
      },
      $inc: {
        [`unread_counts.${otherUserId}`]: 1, // Tự động tăng 1 cho receiver
      },
    },
  )

  return newMessage
}

/**
 * Mark all messages from a user as read
 */
export const markAllAsRead = async (userId, conversationId) => {
  // Find conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  })

  if (!conversation) return null

  const otherUserId = conversation.participants.find((id) => id !== userId)

  // Update all unread messages in this conversation from senderId
  const result = await Message.updateMany(
    {
      conversation_id: conversation._id,
      sender_id: otherUserId,
      status: { $ne: 'read' },
    },
    {
      $set: { status: 'read' },
    },
  )

  // Reset unread count for receiver in conversation
  await Conversation.updateOne(
    { _id: conversation._id },
    { $set: { [`unread_counts.${userId}`]: 0 } },
  )

  return result
}

/**
 * Get conversation between two users (1–1)
 */
export const getConversationByUserIds = async (currentUserId, otherUserId) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, otherUserId] },
  }).lean()

  if (!conversation) return null

  const otherUser = await User.findByPk(otherUserId, {
    attributes: ['id', 'fullName', 'avatar'],
  })

  return {
    id: conversation._id.toString(),
    participants: conversation.participants,
    user: otherUser || null,
    lastMessage: conversation.last_message
      ? {
          message: conversation.last_message.content,
          createdAt: conversation.last_message.created_at,
          type: conversation.last_message.type,
        }
      : null,
    unreadCount: conversation.unread_counts
      ? conversation.unread_counts[currentUserId.toString()] ||
        conversation.unread_counts[currentUserId] ||
        0
      : 0,
  }
}
