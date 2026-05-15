import { StatusCodes } from 'http-status-codes'
import * as callService from '@/services/call.service'
import * as chatService from '@/services/chat.service'

/**
 * Tạo bản ghi call_logs (đang chờ, status null)
 * Client nhận callLogId rồi gửi INVITE và lấy zego-kit-token.
 */
export const startOutgoingVideoCall = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { conversationId } = req.params

    await chatService.ensureConversationParticipant(userId, conversationId)
    const data = await callService.createOutgoingCallLog(userId, conversationId)

    res.status(StatusCodes.CREATED).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Chấp nhận cuộc gọi (receiver) — đồng bộ trước khi client lấy zego-kit-token.
 */
export const acceptCall = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { conversationId, callLogId } = req.params

    await chatService.ensureConversationParticipant(userId, conversationId)
    await callService.acceptCallLog(userId, conversationId, callLogId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: { callLogId: Number(callLogId) },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Kit Token ZEGOCLOUD
 * - Participant + call_log (ringing | answered).
 * - Call phải accept (durationSeconds === -1) trước khi join room
 */
export const getZegoKitToken = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { conversationId } = req.params
    const { callLogId } = req.validatedQuery

    await chatService.ensureConversationParticipant(userId, conversationId)
    const data = await callService.issueZegoKitTokenForConversation(
      userId,
      conversationId,
      callLogId,
    )

    res.status(StatusCodes.OK).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}
