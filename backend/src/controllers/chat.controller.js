import { StatusCodes } from 'http-status-codes'
import * as chatService from '@/services/chat.service'

/**
 * Get conversations for logged in user (cursor-based)
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { nextCursor, limit = 20, search } = req.validatedQuery

    const result = await chatService.getConversations(userId, {
      cursor: nextCursor,
      limit,
      search
    })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get messages by conversationId (cursor-based)
 */
export const getMessagesByConversationId = async (req, res, next) => {
  try {
    const currentUserId = req.user.id // from JWT token
    const { conversationId } = req.params
    const { nextCursor, limit = 20 } = req.validatedQuery

    const result = await chatService.getMessagesByConversationId(
      currentUserId,
      conversationId,
      { cursor: nextCursor, limit }
    )

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Send a message
 */
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id // from JWT token
    const message = await chatService.sendMessage(senderId, req.body)

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: message
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mark all messages from a sender as read
 */
export const markAllMessagesAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { conversationId } = req.params

    await chatService.markAllMessagesAsRead(userId, conversationId)

    res.status(StatusCodes.OK).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get messages between current user and another user (cursor-based)
 */
export const getMessagesByUserIds = async (req, res, next) => {
  try {
    const currentUserId = req.user.id // from JWT token
    const { userId: otherUserId } = req.params
    const { nextCursor, limit = 20 } = req.validatedQuery

    const result = await chatService.getMessagesByUserIds(
      currentUserId,
      otherUserId,
      { cursor: nextCursor, limit }
    )

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}
