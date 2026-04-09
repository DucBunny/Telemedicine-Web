import * as notificationRepo from '@/repositories/notification.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

/**
 * Get notifications for user - Cursor-based pagination
 */
export const getNotifications = async (userId, filters) => {
  return await notificationRepo.getNotifications(userId, filters)
}

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId) => {
  return await notificationRepo.getUnreadCount(userId)
}

/**
 * Mark 1 notification as read
 */
export const markAsRead = async (notificationId, userId) => {
  const notification = await notificationRepo.markAsRead(notificationId, userId)
  if (!notification)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Notification not found or unauthorized',
      'NOTIFICATION_NOT_FOUND'
    )

  return notification
}

/**
 * Mark 1 notification as unread
 */
export const markAsUnread = async (notificationId, userId) => {
  const notification = await notificationRepo.markAsUnread(
    notificationId,
    userId
  )
  if (!notification)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Notification not found or unauthorized',
      'NOTIFICATION_NOT_FOUND'
    )

  return notification
}

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId) => {
  return await notificationRepo.markAllAsRead(userId)
}

/**
 * Create notification
 */
export const createNotification = async (data) => {
  return await notificationRepo.create(data)
}

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId, userId) => {
  const deleted = await notificationRepo.deleteNotification(
    notificationId,
    userId
  )
  if (!deleted)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Notification not found or unauthorized',
      'NOTIFICATION_NOT_FOUND'
    )

  return true
}
