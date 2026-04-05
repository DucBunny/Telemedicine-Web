import { z } from 'zod'
import { idParamSchema } from '@/validations/common.validation'

/**
 * Cursor pagination schema cho chat
 */
const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
})

/**
 * Get conversations query schema (cursor-based)
 */
export const getConversationsQuerySchema = cursorPaginationSchema

/**
 * Get messages query schema (cursor-based)
 */
export const getMessagesQuerySchema = cursorPaginationSchema.extend({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50)
})

/**
 * Get messages param schema (userId)
 */
export const getMessagesParamSchema = z.object({
  userId: z.coerce.number().int().positive('User ID không hợp lệ')
})

/**
 * Send message body schema
 */
export const sendMessageSchema = z
  .object({
    receiverId: z.coerce.number().int().positive('Receiver ID không hợp lệ'),
    message: z
      .string()
      .max(2000, 'Tin nhắn không được vượt quá 2000 ký tự')
      .optional(),
    type: z.enum(['text', 'image', 'file']).optional().default('text'),
    fileUrl: z.string().url('URL file không hợp lệ').optional(),
    fileName: z.string().max(255).optional()
  })
  .refine(
    (data) => {
      // Either message or fileUrl must be present
      return data.message || data.fileUrl
    },
    { message: 'Tin nhắn hoặc file đính kèm là bắt buộc' }
  )
  .refine(
    (data) => {
      // If type is image/file, fileUrl is required
      if (data.type === 'image' || data.type === 'file') {
        return !!data.fileUrl
      }
      return true
    },
    { message: 'File URL là bắt buộc cho tin nhắn ảnh/file' }
  )

/**
 * Mark message as read param schema
 */
export const markMessageAsReadParamSchema = idParamSchema
