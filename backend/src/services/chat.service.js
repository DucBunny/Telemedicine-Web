import { StatusCodes } from 'http-status-codes'
import { User } from '@/models/sql/index'
import * as chatRepo from '@/repositories/chat.repo'
import {
  emitChatMessageNew,
  emitChatMessageRead,
} from '@/sockets/emitters/chat.emitters'
import ApiError from '@/utils/api-error'

/**
 * Get conversations for logged in user
 */
export const getConversations = async (userId, { cursor, limit, search }) => {
  return await chatRepo.getConversations(userId, { cursor, limit, search })
}

/**
 * Get messages by conversationId
 */
export const getMessagesByConversationId = async (
  currentUserId,
  conversationId,
  { cursor, limit },
) => {
  return await chatRepo.getMessagesByConversationId(
    currentUserId,
    conversationId,
    {
      cursor,
      limit,
    },
  )
}

/**
 * Get conversation detail
 */
export const getConversationDetail = async (currentUserId, conversationId) => {
  return await chatRepo.getConversationDetail(currentUserId, conversationId)
}

/**
 * Send a message
 */
export const sendMessage = async (senderId, data) => {
  // Validate sender
  if (senderId === data.receiverId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot send message to yourself',
      'INVALID_RECEIVER',
    )
  }

  const message = await chatRepo.createMessage({
    senderId,
    ...data,
  })

  const sender = await User.findByPk(senderId, {
    attributes: ['id', 'fullName', 'avatar'],
  })

  emitChatMessageNew(data.conversationId, {
    id: message._id.toString(),
    conversationId: data.conversationId,
    sender: sender
      ? {
          id: sender.id,
          fullName: sender.fullName,
          avatar: sender.avatar,
        }
      : { id: senderId, fullName: 'Unknown', avatar: null },
    type: message.type,
    content: message.content,
    status: message.status,
    createdAt: message.created_at,
  })

  return message
}

/**
 * Mark all messages from a sender as read
 */
export const markAllMessagesAsRead = async (userId, conversationId) => {
  const result = await chatRepo.markAllAsRead(userId, conversationId)

  emitChatMessageRead(conversationId, {
    conversationId,
    readerId: userId,
    timestamp: Date.now(),
  })

  return result
}

/**
 * Get messages between current user and another user
 */
export const getMessagesByUserIds = async (
  currentUserId,
  otherUserId,
  { cursor, limit },
) => {
  return await chatRepo.getMessagesByUserIds(currentUserId, otherUserId, {
    cursor,
    limit,
  })
}
