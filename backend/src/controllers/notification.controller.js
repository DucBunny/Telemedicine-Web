import { StatusCodes } from 'http-status-codes'
import * as notificationService from '@/services/notification.service'

/**
 * Get notifications for logged in user
 */
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { nextCursor, limit = 8, isRead } = req.validatedQuery

    const result = await notificationService.getNotifications(userId, {
      nextCursor,
      limit,
      isRead
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
 * Get unread notification count
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id

    const count = await notificationService.getUnreadCount(userId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: { count }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mark 1 notification as read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { notificationId } = req.params

    const notification = await notificationService.markAsRead(
      notificationId,
      userId
    )

    res.status(StatusCodes.OK).json({
      success: true,
      data: notification
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mark 1 notification as unread
 */
export const markAsUnread = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { notificationId } = req.params

    const notification = await notificationService.markAsUnread(
      notificationId,
      userId
    )

    res.status(StatusCodes.OK).json({
      success: true,
      data: notification
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id

    await notificationService.markAllAsRead(userId)

    res.status(StatusCodes.OK).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete notification
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { notificationId } = req.params

    await notificationService.deleteNotification(notificationId, userId)

    res.status(StatusCodes.OK).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}
