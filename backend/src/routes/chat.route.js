import express from 'express'
import * as chatController from '@/controllers/chat.controller'
import { validate } from '@/middlewares/validation.middleware'
import {
  getConversationsQuerySchema,
  getMessagesQuerySchema,
  getMessagesParamSchema,
  sendMessageSchema,
  markMessageAsReadParamSchema
} from '@/validations/chat.validation'

const router = express.Router()

// Note: Authentication is applied globally in api.js

// Get conversations list
router.get(
  '/conversations',
  validate({ query: getConversationsQuerySchema }),
  chatController.getConversations
)

// Get messages with a specific user (legacy - by userId)
router.get(
  '/conversations/:userId/messages',
  validate({ params: getMessagesParamSchema, query: getMessagesQuerySchema }),
  chatController.getMessages
)

// Get messages by conversationId
router.get(
  '/conversations/:conversationId/messages-by-id',
  validate({ query: getMessagesQuerySchema }),
  chatController.getMessagesByConversationId
)

// Send a message
router.post(
  '/messages',
  validate({ body: sendMessageSchema }),
  chatController.sendMessage
)

// Mark a message as read
router.patch(
  '/messages/:id/read',
  validate({ params: markMessageAsReadParamSchema }),
  chatController.markMessageAsRead
)

// Mark all messages from a user as read
router.patch(
  '/conversations/:userId/read-all',
  validate({ params: getMessagesParamSchema }),
  chatController.markAllMessagesAsRead
)

export default router
