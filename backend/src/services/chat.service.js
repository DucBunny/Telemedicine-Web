import * as chatRepo from '@/repositories/chat.repo'
import { StatusCodes } from 'http-status-codes'
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
  { cursor, limit }
) => {
  return await chatRepo.getMessagesByConversationId(
    currentUserId,
    conversationId,
    {
      cursor,
      limit
    }
  )
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
      'INVALID_RECEIVER'
    )
  }

  return await chatRepo.createMessage({
    senderId,
    ...data
  })
}

/**
 * Mark all messages from a sender as read
 */
export const markAllMessagesAsRead = async (userId, conversationId) => {
  return await chatRepo.markAllAsRead(userId, conversationId)
}

/**
 * Get messages between current user and another user
 */
export const getMessagesByUserIds = async (
  currentUserId,
  otherUserId,
  { cursor, limit }
) => {
  return await chatRepo.getMessagesByUserIds(currentUserId, otherUserId, {
    cursor,
    limit
  })
}
