import express from 'express'
import * as notificationController from '@/controllers/notification.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  markNotificationAsReadParamSchema,
  markNotificationAsUnreadParamSchema,
  deleteNotificationParamSchema
} from '@/validations/notification.validation'

const router = express.Router()

// Get unread count
router.get(
  '/unread-count',
  authorizeRoles(['patient', 'doctor', 'admin']),
  notificationController.getUnreadCount
)

// Mark all notifications as read
router.put(
  '/read-all',
  authorizeRoles(['patient', 'doctor', 'admin']),
  notificationController.markAllAsRead
)

// Mark 1 notification as read
router.put(
  '/:notificationId/read',
  authorizeRoles(['patient', 'doctor', 'admin']),
  validate({ params: markNotificationAsReadParamSchema }),
  notificationController.markAsRead
)

// Mark 1 notification as unread
router.put(
  '/:notificationId/unread',
  authorizeRoles(['patient', 'doctor', 'admin']),
  validate({ params: markNotificationAsUnreadParamSchema }),
  notificationController.markAsUnread
)

// Delete notification
router.delete(
  '/:notificationId',
  authorizeRoles(['patient', 'doctor', 'admin']),
  validate({ params: deleteNotificationParamSchema }),
  notificationController.deleteNotification
)

export default router
