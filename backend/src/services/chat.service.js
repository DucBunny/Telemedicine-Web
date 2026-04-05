import * as chatRepo from '@/repositories/chat.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

/**
 * Get conversations for logged in user
 */
export const getConversations = async (userId, { page, limit }) => {
  return await chatRepo.getConversations(userId, { page, limit })
}

/**
 * Get messages between current user and another user
 */
export const getMessages = async (
  currentUserId,
  otherUserId,
  { page, limit }
) => {
  return await chatRepo.getMessages(currentUserId, otherUserId, { page, limit })
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

  const message = await chatRepo.createMessage({
    senderId,
    ...data
  })

  return message
}

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId, userId) => {
  const message = await chatRepo.markAsRead(messageId)

  if (!message) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Message not found',
      'MESSAGE_NOT_FOUND'
    )
  }

  // Verify user is NOT the sender (can only mark received messages as read)
  if (message.sender_id === userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You can only mark received messages as read',
      'FORBIDDEN'
    )
  }

  return message
}

/**
 * Mark all messages from a sender as read
 */
export const markAllMessagesAsRead = async (receiverId, senderId) => {
  return await chatRepo.markAllAsRead(receiverId, senderId)
}

/**
 * Get messages by conversationId
 */
export const getMessagesByConversationId = async (
  currentUserId,
  conversationId,
  { cursor, limit }
) => {
  return await chatRepo.getMessagesByConversationId(currentUserId, conversationId, {
    cursor,
    limit
  })
}
