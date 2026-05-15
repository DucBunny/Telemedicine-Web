import { StatusCodes } from 'http-status-codes'
import { env } from '@/config/env'
import { generateToken04 } from '@/lib/zego/zegoServerAssistant'
import { CallLog, User } from '@/models/sql/index'
import * as chatRepo from '@/repositories/chat.repo'
import * as userRepo from '@/repositories/user.repo'
import { emitChatMessageNew } from '@/sockets/emitters/chat.emitters'
import ApiError from '@/utils/api-error'

/**
 * -1: đã trả lời, chưa kết thúc.
 */
const CALL_ANSWERED_SENTINEL_DURATION = -1

/**
 * Room ID: conv_{conversationId}_call_{callLogId}
 * @param {string} conversationId
 * @param {number} callLogId
 * @returns {string} Zego room ID (max 128 characters)
 */
export const buildZegoRoomId = (conversationId, callLogId) => {
  const safeConvId = String(conversationId).replace(/[^a-zA-Z0-9_-]/g, '') // Remove special characters
  const callLogIdNumber = Number(callLogId)
  if (
    !safeConvId ||
    !Number.isFinite(callLogIdNumber) ||
    callLogIdNumber <= 0
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Invalid conversation or call log id for Zego room',
      'CALL_ROOM_INVALID',
    )
  }
  return `conv_${safeConvId}_call_${callLogIdNumber}`.slice(0, 128) // Limit to 128 characters
}

/**
 * Kiểm tra xem user có thể sử dụng call log này không
 * @param {number} callLogId
 * @param {number} userId
 * @param {string} conversationId
 * @returns {Promise<CallLog>} Call log nếu hợp lệ, nếu không thì throw error
 */
export const assertUserCanUseCallLog = async (
  callLogId,
  userId,
  conversationId,
) => {
  const callLogIdNumber = Number(callLogId)
  if (!Number.isFinite(callLogIdNumber) || callLogIdNumber <= 0)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Invalid call log id',
      'CALL_LOG_INVALID',
    )

  const peerUserId = await chatRepo.getPeerUserIdIfParticipant(
    userId,
    conversationId,
  )
  if (!peerUserId)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Peer not found in conversation',
      'CALL_PEER_NOT_FOUND',
    )

  const callLog = await CallLog.findByPk(callLogId)
  if (!callLog)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Call not found',
      'CALL_NOT_FOUND',
    )

  const userIdNumber = Number(userId)
  const callerUserId = Number(callLog.callerId)
  const receiverUserId = Number(callLog.receiverId)
  const isParticipant =
    (userIdNumber === callerUserId && peerUserId === receiverUserId) ||
    (userIdNumber === receiverUserId && peerUserId === callerUserId)

  if (!isParticipant)
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Not a participant of this call',
      'CALL_FORBIDDEN',
    )

  return callLog
}

/**
 * Tạo call log mới (đang chờ, status null)
 * @param {number} callerId
 * @param {string} conversationId
 * @returns {Promise<{ callLogId: number }>} Call log ID
 */
export const createOutgoingCallLog = async (callerId, conversationId) => {
  const peerUserId = await chatRepo.getPeerUserIdIfParticipant(
    callerId,
    conversationId,
  )
  if (!peerUserId)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Peer not found in conversation',
      'CALL_PEER_NOT_FOUND',
    )

  const callLog = await CallLog.create({
    callerId,
    receiverId: peerUserId,
    status: null,
    durationSeconds: 0,
  })

  return { callLogId: callLog.id }
}

/**
 * Emit call message
 * @param {number} senderId
 * @param {string} conversationId
 * @param {object} payload
 * @returns {Promise<Message>} Message
 */
const emitCallMessage = async (senderId, conversationId, payload) => {
  const message = await chatRepo.createMessage({
    senderId,
    conversationId,
    type: 'call',
    message: '',
    ...payload,
  })

  const sender = await User.findByPk(senderId, {
    attributes: ['id', 'fullName', 'avatar'],
  })

  emitChatMessageNew(conversationId, {
    id: message._id.toString(),
    conversationId,
    sender: sender
      ? {
          id: sender.id,
          fullName: sender.fullName,
          avatar: sender.avatar,
        }
      : { id: senderId, fullName: 'Unknown', avatar: null },
    type: message.type,
    content: message.content,
    status: message.status,
    createdAt: message.created_at,
  })
}

/**
 * Call accept call log
 * Set duration = -1 (đã trả lời, chưa kết thúc).
 */
export const acceptCallLog = async (userId, conversationId, callLogId) => {
  const callLog = await assertUserCanUseCallLog(
    callLogId,
    userId,
    conversationId,
  )
  // Nếu người nhận không phải là user hiện tại
  if (Number(callLog.receiverId) !== Number(userId))
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only receiver can accept',
      'CALL_ACCEPT_FORBIDDEN',
    )

  // Nếu call log đã kết thúc (status !== null)
  if (callLog.status !== null)
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Call already ended',
      'CALL_ALREADY_ENDED',
    )

  if (Number(callLog.durationSeconds) === CALL_ANSWERED_SENTINEL_DURATION)
    return callLog

  await callLog.update({
    durationSeconds: CALL_ANSWERED_SENTINEL_DURATION,
  })
  return callLog
}

/**
 * Call reject call log
 * Set status = 'rejected' + tin nhắn (người gửi = caller).
 */
export const rejectCallLog = async (userId, conversationId, callLogId) => {
  const callLog = await assertUserCanUseCallLog(
    callLogId,
    userId,
    conversationId,
  )
  // Nếu người nhận không phải là user hiện tại
  if (Number(callLog.receiverId) !== Number(userId))
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only receiver can reject',
      'CALL_REJECT_FORBIDDEN',
    )

  // Nếu call log đã kết thúc (status !== null) thì không làm gì cả
  if (callLog.status !== null) return callLog

  // Cập nhật status = 'rejected' + durationSeconds = 0
  await callLog.update({
    status: 'rejected',
    durationSeconds: 0,
  })
  await emitCallMessage(callLog.callerId, conversationId, {
    callId: callLog.id,
    callStatus: 'rejected',
  })

  return callLog
}

/**
 * End call log
 * - Đã accept (duration -1) → completed + duration;
 * - Chưa accept → missed.
 */
export const endCallLog = async (
  userId,
  conversationId,
  callLogId,
  durationSeconds = 0,
) => {
  const callLog = await assertUserCanUseCallLog(
    callLogId,
    userId,
    conversationId,
  )
  const duration = Math.max(0, Math.floor(Number(durationSeconds) || 0))

  // Nếu call log đã kết thúc (status !== null) thì không làm gì cả
  if (callLog.status !== null) return callLog

  // Nếu call log đã được chấp nhận (durationSeconds = -1) thì set status = 'completed' + durationSeconds = duration
  const wasAnswered =
    Number(callLog.durationSeconds) === CALL_ANSWERED_SENTINEL_DURATION

  if (wasAnswered) {
    await callLog.update({
      status: 'completed',
      durationSeconds: duration,
    })
    await emitCallMessage(callLog.callerId, conversationId, {
      callId: callLog.id,
      callStatus: 'completed',
      callDuration: duration,
    })
    return callLog
  }

  // Nếu call log chưa được chấp nhận (durationSeconds !== -1) thì set status = 'missed' + durationSeconds = 0
  await callLog.update({
    status: 'missed',
    durationSeconds: 0,
  })
  await emitCallMessage(callLog.callerId, conversationId, {
    callId: callLog.id,
    callStatus: 'missed',
  })
  return callLog
}

/**
 * Token Zego — chỉ khi call chưa kết thúc (status null).
 * Call phải accept (durationSeconds === -1) trước khi join room
 */
export const issueZegoKitTokenForConversation = async (
  userId,
  conversationId,
  callLogId,
) => {
  const appID = Number(env.ZEGO_APP_ID)
  if (!env.ZEGO_SERVER_SECRET || Number.isNaN(appID))
    throw new ApiError(
      StatusCodes.SERVICE_UNAVAILABLE,
      'Video call (ZEGOCLOUD) is not configured on server',
      'ZEGO_NOT_CONFIGURED',
    )

  const callLog = await assertUserCanUseCallLog(
    callLogId,
    userId,
    conversationId,
  )
  if (callLog.status !== null)
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Call is not active for joining',
      'CALL_NOT_JOINABLE',
    )

  const isReceiver = Number(callLog.receiverId) === Number(userId)
  // Nếu là receiver và call log chưa được chấp nhận (durationSeconds !== -1) thì throw error
  if (
    isReceiver &&
    Number(callLog.durationSeconds) !== CALL_ANSWERED_SENTINEL_DURATION
  )
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Accept the call before joining',
      'CALL_NOT_ACCEPTED',
    )

  const user = await userRepo.getNameById(userId)
  const userName = user?.fullName || `user_${userId}`
  const roomID = buildZegoRoomId(conversationId, callLogId)
  const userID = String(userId)

  let token
  try {
    token = generateToken04(appID, userID, env.ZEGO_SERVER_SECRET, 3600, '')
  } catch (err) {
    const msg =
      err &&
      typeof err === 'object' &&
      'errorMessage' in err &&
      typeof err.errorMessage === 'string'
        ? err.errorMessage
        : err instanceof Error
          ? err.message
          : 'Failed to generate ZEGO token'
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      msg,
      'ZEGO_TOKEN_ERROR',
    )
  }

  return {
    appId: appID,
    token,
    roomId: roomID,
    userId: userID,
    userName,
    callLogId: callLog.id,
  }
}
