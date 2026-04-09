import express from 'express'
import * as chatController from '@/controllers/chat.controller'
import { validate } from '@/middlewares/validation.middleware'
import {
  getConversationsQuerySchema,
  getMessagesQuerySchema,
  getMessagesParamSchema,
  getConversationIdParamSchema,
  sendMessageSchema
} from '@/validations/chat.validation'

const router = express.Router()

// Get conversations list
router.get(
  '/conversations',
  validate({ query: getConversationsQuerySchema }),
  chatController.getConversations
)

// Send a message
router.post(
  '/messages',
  validate({ body: sendMessageSchema }),
  chatController.sendMessage
)

// Get messages by conversationId
router.get(
  '/conversations/:conversationId/messages',
  validate({
    params: getConversationIdParamSchema,
    query: getMessagesQuerySchema
  }),
  chatController.getMessagesByConversationId
)

// Mark all messages from a user as read
router.put(
  '/conversations/:conversationId/read-all',
  validate({ params: getConversationIdParamSchema }),
  chatController.markAllMessagesAsRead
)

// Legacy route for clients still using userId; resolves to the conversation lookup endpoint internally.
router.get(
  '/users/:userId/messages',
  validate({
    params: getMessagesParamSchema,
    query: getMessagesQuerySchema
  }),
  chatController.getMessagesByUserIds
)

export default router
