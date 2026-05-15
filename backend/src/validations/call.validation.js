import { z } from 'zod'
import { intIdSchema, objectIdSchema } from '@/validations/common.validation'

/**
 * Get messages param schema (conversationId)
 */
export const getConversationIdParamSchema = z.object({
  conversationId: objectIdSchema('Conversation ID is invalid'),
})

/**
 * zego-kit-token query schema
 */
export const zegoKitTokenQuerySchema = z.object({
  callLogId: intIdSchema('Call log ID is invalid'),
})

/**
 * Call accept params schema
 */
export const acceptCallParamsSchema = z.object({
  conversationId: objectIdSchema('Conversation ID is invalid'),
  callLogId: intIdSchema('Call log ID is invalid'),
})
