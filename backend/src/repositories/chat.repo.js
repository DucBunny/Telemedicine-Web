import Conversation from '@/models/nosql/conversation'
import Message from '@/models/nosql/message'
import { User } from '@/models/sql/index'
import mongoose from 'mongoose'

/**
 * Get all conversations for a user (cursor-based pagination)
 * Cursor dựa trên last_message.created_at để sắp xếp theo thời gian
 */
export const getConversations = async (userId, { cursor, limit = 20 }) => {
  const query = { participants: userId }

  // Nếu có cursor, lấy các conversation có last_message.created_at < cursor
  if (cursor) {
    query['last_message.created_at'] = { $lt: new Date(cursor) }
  }

  const conversations = await Conversation.find(query)
    .sort({ 'last_message.created_at': -1 })
    .limit(parseInt(limit) + 1) // Lấy thêm 1 để check hasMore
    .lean()

  // Check if there are more results
  const hasMore = conversations.length > limit
  if (hasMore) {
    conversations.pop() // Remove extra item
  }

  // Get next cursor from last item
  const nextCursor =
    conversations.length > 0
      ? conversations[
          conversations.length - 1
        ].last_message?.created_at?.toISOString()
      : null

  // Get other participants' IDs
  const otherUserIds = conversations.map((conv) =>
    conv.participants.find((id) => id !== userId)
  )

  // Get user details from SQL
  const users = await User.findAll({
    where: { id: otherUserIds },
    attributes: ['id', 'fullName', 'avatar', 'email']
  })

  const userMap = {}
  users.forEach((user) => {
    userMap[user.id] = {
      id: user.id,
      fullName: user.fullName,
      avatar: user.avatar,
      email: user.email
    }
  })

  // Format the response
  const data = conversations.map((conv) => {
    const otherUserId = conv.participants.find((id) => id !== userId)
    // Khi dùng .lean(), unread_counts là object thường thay vì Map
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
            status: conv.last_message.status || 'sent'
          }
        : null,
      unreadCount
    }
  })

  return {
    data,
    meta: {
      nextCursor,
      hasMore,
      limit: parseInt(limit)
    }
  }
}

/**
 * Get messages between two users (cursor-based pagination)
 * Cursor dựa trên _id của message
 */
export const getMessages = async (userId1, userId2, { cursor, limit = 50 }) => {
  // Find conversation
  const conversation = await Conversation.findOne({
    participants: { $all: [userId1, userId2] }
  }).lean()

  if (!conversation) {
    return {
      data: [],
      meta: {
        nextCursor: null,
        hasMore: false,
        limit: parseInt(limit)
      }
    }
  }

  const query = { conversation_id: conversation._id }

  // Nếu có cursor, lấy messages có _id < cursor (older messages)
  if (cursor) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) }
  }

  // Get messages (newest first, then reverse for display)
  const messages = await Message.find(query)
    .sort({ _id: -1 })
    .limit(parseInt(limit) + 1)
    .lean()

  // Check if there are more results
  const hasMore = messages.length > limit
  if (hasMore) {
    messages.pop()
  }

  // Get next cursor from last item (oldest in this batch)
  const nextCursor =
    messages.length > 0 ? messages[messages.length - 1]._id.toString() : null

  // Get user details from SQL
  const users = await User.findAll({
    where: { id: [userId1, userId2] },
    attributes: ['id', 'fullName', 'avatar']
  })

  const userMap = {}
  users.forEach((user) => {
    userMap[user.id] = {
      id: user.id,
      fullName: user.fullName,
      avatar: user.avatar
    }
  })

  // Format messages with user details and reverse for chronological order
  const data = messages
    .map((msg) => ({
      id: msg._id.toString(),
      sender: userMap[msg.sender_id],
      receiver: userMap[userId1 === msg.sender_id ? userId2 : userId1],
      type: msg.type,
      content: msg.content,
      status: msg.status,
      createdAt: msg.created_at
    }))
    .reverse()

  return {
    data,
    meta: {
      nextCursor,
      hasMore,
      limit: parseInt(limit)
    }
  }
}

/**
 * Send a message
 */
export const createMessage = async (data) => {
  const {
    senderId,
    receiverId,
    message,
    type = 'text',
    fileUrl,
    fileName
  } = data

  // Find or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] }
  })

  if (!conversation) {
    // Create new conversation
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      unread_counts: new Map([
        [receiverId.toString(), 0],
        [senderId.toString(), 0]
      ])
    })
  }

  // Create message content based on type
  const messageContent = {}

  if (message) {
    messageContent.text = message
  }

  if (fileUrl) {
    messageContent.file_url = fileUrl
    if (fileName) {
      messageContent.file_name = fileName
    }
  }

  // Create message
  const newMessage = await Message.create({
    conversation_id: conversation._id,
    sender_id: senderId,
    type,
    content: messageContent,
    status: 'sent'
  })

  // Update conversation's last_message with appropriate content
  let lastMessageContent = message || ''
  if (type === 'image') {
    lastMessageContent = '📷 Đã gửi một ảnh'
  } else if (type === 'file') {
    lastMessageContent = `📎 ${fileName || 'Đã gửi file'}`
  }

  conversation.last_message = {
    message_id: newMessage._id,
    sender_id: senderId,
    type: newMessage.type,
    content: lastMessageContent,
    created_at: newMessage.created_at
  }

  // Increment unread count for receiver
  const currentUnreadCount =
    conversation.unread_counts.get(receiverId.toString()) || 0
  conversation.unread_counts.set(receiverId.toString(), currentUnreadCount + 1)

  await conversation.save()

  return newMessage
}

/**
 * Mark message as read
 */
export const markAsRead = async (messageId) => {
  const message = await Message.findById(messageId)
  if (!message) return null

  message.status = 'read'
  await message.save()

  return message
}

/**
 * Mark all messages from a user as read
 */
export const markAllAsRead = async (receiverId, senderId) => {
  // Find conversation
  const conversation = await Conversation.findOne({
    participants: { $all: [receiverId, senderId] }
  })

  if (!conversation) return { modifiedCount: 0 }

  // Update all unread messages in this conversation from senderId
  const result = await Message.updateMany(
    {
      conversation_id: conversation._id,
      sender_id: senderId,
      status: { $ne: 'read' }
    },
    {
      $set: { status: 'read' }
    }
  )

  // Reset unread count for receiver in conversation
  conversation.unread_counts.set(receiverId.toString(), 0)
  await conversation.save()

  return result
}

/**
 * Get messages by conversationId (cursor-based pagination)
 */
export const getMessagesByConversationId = async (
  currentUserId,
  conversationId,
  { cursor, limit = 50 }
) => {
  // Validate conversationId format
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return {
      data: [],
      meta: {
        nextCursor: null,
        hasMore: false,
        limit: parseInt(limit)
      }
    }
  }

  // Find conversation and verify user is a participant
  const conversation = await Conversation.findOne({
    _id: new mongoose.Types.ObjectId(conversationId),
    participants: currentUserId
  }).lean()

  if (!conversation) {
    return {
      data: [],
      meta: {
        nextCursor: null,
        hasMore: false,
        limit: parseInt(limit)
      }
    }
  }

  const query = { conversation_id: conversation._id }

  // Nếu có cursor, lấy messages có _id < cursor (older messages)
  if (cursor) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) }
  }

  // Get messages (newest first, then reverse for display)
  const messages = await Message.find(query)
    .sort({ _id: -1 })
    .limit(parseInt(limit) + 1)
    .lean()

  // Check if there are more results
  const hasMore = messages.length > limit
  if (hasMore) {
    messages.pop()
  }

  // Get next cursor from last item (oldest in this batch)
  const nextCursor =
    messages.length > 0 ? messages[messages.length - 1]._id.toString() : null

  // Get other participant's ID
  const otherUserId = conversation.participants.find((id) => id !== currentUserId)

  // Get user details from SQL
  const users = await User.findAll({
    where: { id: [currentUserId, otherUserId] },
    attributes: ['id', 'fullName', 'avatar']
  })

  const userMap = {}
  users.forEach((user) => {
    userMap[user.id] = {
      id: user.id,
      fullName: user.fullName,
      avatar: user.avatar
    }
  })

  // Format messages with user details and reverse for chronological order
  const data = messages
    .map((msg) => ({
      id: msg._id.toString(),
      sender: userMap[msg.sender_id],
      receiver: userMap[currentUserId === msg.sender_id ? otherUserId : currentUserId],
      type: msg.type,
      content: msg.content,
      status: msg.status,
      createdAt: msg.created_at
    }))
    .reverse()

  return {
    data,
    meta: {
      nextCursor,
      hasMore,
      limit: parseInt(limit)
    }
  }
}
