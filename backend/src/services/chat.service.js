import { StatusCodes } from 'http-status-codes'
import { User } from '@/models/sql/index'
import * as chatRepo from '@/repositories/chat.repo'
import {
  emitChatMessageNew,
  emitChatMessageRead,
} from '@/sockets/emitters/chat.emitters'
import ApiError from '@/utils/api-error'

/**
 * Đảm bảo user là participant của conversation
 */
export const ensureConversationParticipant = async (userId, conversationId) => {
  const isParticipant = await chatRepo.isConversationParticipant(
    userId,
    conversationId,
  )

  if (!isParticipant)
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not a participant in this conversation',
      'CHAT_NOT_PARTICIPANT',
    )
}

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
  const result = await chatRepo.getMessagesByConversationId(
    currentUserId,
    conversationId,
    {
      cursor,
      limit,
    },
  )

  if (!result)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Conversation not found',
      'CONVERSATION_NOT_FOUND',
    )

  return result
}

/**
 * Get conversation detail
 */
export const getConversationDetail = async (currentUserId, conversationId) => {
  const conversation = await chatRepo.getConversationDetail(
    currentUserId,
    conversationId,
  )

  if (!conversation)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Conversation not found',
      'CONVERSATION_NOT_FOUND',
    )

  return conversation
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

  if (!message)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Failed to send message',
      'MESSAGE_SEND_FAILED',
    )

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

  if (!result)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Conversation not found',
      'CONVERSATION_NOT_FOUND',
    )

  emitChatMessageRead(conversationId, {
    conversationId,
    readerId: userId,
    timestamp: Date.now(),
  })

  return result
}

/**
 * Get conversation between current user and another user
 */
export const getConversationByUserIds = async (currentUserId, otherUserId) => {
  const conversation = await chatRepo.getConversationByUserIds(
    currentUserId,
    otherUserId,
  )

  if (!conversation) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Conversation not found',
      'CONVERSATION_NOT_FOUND',
    )
  }

  return conversation
}
