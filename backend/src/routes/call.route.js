import express from 'express'
import * as callController from '@/controllers/call.controller'
import { validate } from '@/middlewares/validation.middleware'
import {
  acceptCallParamsSchema,
  getConversationIdParamSchema,
  zegoKitTokenQuerySchema,
} from '@/validations/call.validation'

const router = express.Router()

// Bắt đầu cuộc gọi video — tạo call_logs, trả callLogId
router.post(
  '/conversations/:conversationId/calls',
  validate({
    params: getConversationIdParamSchema,
  }),
  callController.startOutgoingVideoCall,
)

// Người nhận chấp nhận cuộc gọi (trước khi join Zego)
router.post(
  '/conversations/:conversationId/calls/:callLogId/accept',
  validate({
    params: acceptCallParamsSchema,
  }),
  callController.acceptCall,
)

// ZEGOCLOUD kit token (participant only)
router.get(
  '/conversations/:conversationId/zego-kit-token',
  validate({
    params: getConversationIdParamSchema,
    query: zegoKitTokenQuerySchema,
  }),
  callController.getZegoKitToken,
)

export default router
