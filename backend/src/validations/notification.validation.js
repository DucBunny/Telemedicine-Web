import { z } from 'zod'
import {
  idParamSchema,
  paginationQuerySchema
} from '@/validations/common.validation'

/**
 * Notification type enum
 */
const notificationTypeEnum = z.enum(['alert', 'appointment', 'message'], {
  errorMap: () => ({ message: 'Loại thông báo không hợp lệ' })
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
export const markNotificationAsReadParamSchema = idParamSchema

/**
 * Mark notification as unread param schema
 */
export const markNotificationAsUnreadParamSchema = idParamSchema

/**
 * Delete notification param schema
 */
export const deleteNotificationParamSchema = idParamSchema

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
