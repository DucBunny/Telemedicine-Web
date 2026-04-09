import { z } from 'zod'
import {
  intIdSchema,
  objectIdSchema,
  paginationQuerySchema,
  paginationWithSearchSchema
} from '@/validations/common.validation'

/**
 * Get conversations query schema (cursor-based)
 */
export const getConversationsQuerySchema = paginationWithSearchSchema

/**
 * Get messages query schema (cursor-based)
 */
export const getMessagesQuerySchema = paginationQuerySchema

/**
 * Get messages param schema (userId)
 */
export const getMessagesParamSchema = z.object({
  userId: intIdSchema('User ID is invalid')
})

/**
 * Get messages param schema (conversationId)
 */
export const getConversationIdParamSchema = z.object({
  conversationId: objectIdSchema('Conversation ID is invalid')
})

/**
 * Send message body schema
 */
export const sendMessageSchema = z
  .object({
    conversationId: objectIdSchema('Conversation ID is invalid'),
    message: z
      .string()
      .max(2000, 'Message cannot exceed 2000 characters')
      .optional(),
    type: z.enum(['text', 'image', 'file']).optional(),
    fileUrl: z.string().url('Invalid file URL').optional(),
    fileName: z.string().max(255).optional()
  })
  .refine(
    (data) => {
      // Either message or fileUrl must be present
      return data.message || data.fileUrl
    },
    { message: 'Message or file attachment is required' }
  )
  .refine(
    (data) => {
      // If type is image/file, fileUrl is required
      if (data.type === 'image' || data.type === 'file') {
        return !!data.fileUrl
      }
      return true
    },
    { message: 'File URL is required for image/file messages' }
  )
