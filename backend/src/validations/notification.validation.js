import { z } from 'zod'
import {
  intIdSchema,
  paginationQuerySchema
} from '@/validations/common.validation'

/**
 * Notification type enum
 */
const notificationTypeEnum = z.enum(['alert', 'appointment', 'message'], {
  errorMap: () => ({ message: 'Notification type is invalid' })
})

/**
 * Get notifications query schema
 */
export const getNotificationsQuerySchema = paginationQuerySchema.extend({
  isRead: z
    .string()
    .transform((val) => val === 'true')
    .optional()
})

/**
 * Mark notification as read param schema
 */
export const markNotificationAsReadParamSchema = z.object({
  notificationId: intIdSchema('Notification ID is invalid')
})

/**
 * Mark notification as unread param schema
 */
export const markNotificationAsUnreadParamSchema = z.object({
  notificationId: intIdSchema('Notification ID is invalid')
})

/**
 * Delete notification param schema
 */
export const deleteNotificationParamSchema = z.object({
  notificationId: intIdSchema('Notification ID is invalid')
})

//------------------------------------------------
/**
 * Create notification body schema
 */
export const createNotificationSchema = z.object({
  userId: z.coerce.number().int().positive('User ID không hợp lệ'),
  type: notificationTypeEnum,
  title: z
    .string()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  content: z.string().min(1, 'Nội dung không được để trống'),
  referenceId: z.coerce
    .number()
    .int()
    .positive('Reference ID không hợp lệ')
    .optional(),
  senderId: z.coerce
    .number()
    .int()
    .positive('Sender ID không hợp lệ')
    .optional()
})
