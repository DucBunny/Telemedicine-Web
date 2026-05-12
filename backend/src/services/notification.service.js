import { StatusCodes } from 'http-status-codes'
import * as notificationRepo from '@/repositories/notification.repo'
import {
  emitNotificationReadToUser,
  emitNotificationToUser,
  emitNotificationUnreadCountUpdate,
} from '@/sockets/emitters/system.emitters'
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
      'NOTIFICATION_NOT_FOUND',
    )

  emitNotificationReadToUser(userId, { id: notification.id })
  const unreadCount = await notificationRepo.getUnreadCount(userId)
  emitNotificationUnreadCountUpdate(userId, unreadCount)

  return notification
}

/**
 * Mark 1 notification as unread
 */
export const markAsUnread = async (notificationId, userId) => {
  const notification = await notificationRepo.markAsUnread(
    notificationId,
    userId,
  )
  if (!notification)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Notification not found or unauthorized',
      'NOTIFICATION_NOT_FOUND',
    )

  emitNotificationReadToUser(userId, { id: notification.id })
  const unreadCount = await notificationRepo.getUnreadCount(userId)
  emitNotificationUnreadCountUpdate(userId, unreadCount)

  return notification
}

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId) => {
  const result = await notificationRepo.markAllAsRead(userId)
  emitNotificationReadToUser(userId, { id: null }) // id: null -> đã đọc tất cả
  emitNotificationUnreadCountUpdate(userId, 0)
  return result
}

/**
 * Create notification and emit realtime event to recipient
 */
export const createAndSendNotification = async ({
  recipientId,
  senderId,
  type,
  title,
  content,
  referenceId,
}) => {
  const notification = await notificationRepo.create({
    userId: recipientId,
    senderId,
    type,
    title,
    content,
    referenceId,
  })

  emitNotificationToUser(recipientId, {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    content: notification.content,
    referenceId: notification.referenceId,
    senderId: notification.senderId,
    isRead: notification.isRead ?? false,
    createdAt: notification.createdAt,
  })

  const unreadCount = await notificationRepo.getUnreadCount(recipientId)
  emitNotificationUnreadCountUpdate(recipientId, unreadCount)

  return notification
}

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId, userId) => {
  const deleted = await notificationRepo.deleteNotification(
    notificationId,
    userId,
  )
  if (!deleted)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Notification not found or unauthorized',
      'NOTIFICATION_NOT_FOUND',
    )

  const unreadCount = await notificationRepo.getUnreadCount(userId)
  emitNotificationUnreadCountUpdate(userId, unreadCount)

  return true
}
