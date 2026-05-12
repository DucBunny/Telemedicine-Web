import { z } from 'zod'
import {
  intIdSchema,
  paginationQuerySchema,
} from '@/validations/common.validation'

/**
 * Get notifications query schema
 */
export const getNotificationsQuerySchema = paginationQuerySchema.extend({
  isRead: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
})

/**
 * Mark notification as read param schema
 */
export const markNotificationAsReadParamSchema = z.object({
  notificationId: intIdSchema('Notification ID is invalid'),
})

/**
 * Mark notification as unread param schema
 */
export const markNotificationAsUnreadParamSchema = z.object({
  notificationId: intIdSchema('Notification ID is invalid'),
})

/**
 * Delete notification param schema
 */
export const deleteNotificationParamSchema = z.object({
  notificationId: intIdSchema('Notification ID is invalid'),
})
