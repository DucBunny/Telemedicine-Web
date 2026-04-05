import { StatusCodes } from 'http-status-codes'
import * as chatService from '@/services/chat.service'

/**
 * Get conversations for logged in user (cursor-based)
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { cursor, limit = 20 } = req.query

    const result = await chatService.getConversations(userId, { cursor, limit })

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
 * Get messages between current user and another user (cursor-based)
 */
export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.user.id // from JWT token
    const { userId: otherUserId } = req.params
    const { cursor, limit = 50 } = req.query

    const result = await chatService.getMessages(
      currentUserId,
      parseInt(otherUserId),
      { cursor, limit }
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
 * Mark message as read
 */
export const markMessageAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { id } = req.params

    const message = await chatService.markMessageAsRead(id, userId)

    res.status(StatusCodes.OK).json({
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
    const receiverId = req.user.id // from JWT token
    const { userId: senderId } = req.params

    await chatService.markAllMessagesAsRead(receiverId, parseInt(senderId))

    res.status(StatusCodes.OK).json({
      success: true,
      data: { message: 'All messages marked as read' }
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
    const { cursor, limit = 50 } = req.query

    const result = await chatService.getMessagesByConversationId(
      currentUserId,
      conversationId,
      { cursor, limit }
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
