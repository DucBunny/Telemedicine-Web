import * as presenceCache from '@/cache/presence.cache'
import { CallLog } from '@/models/sql/index'
import * as chatRepo from '@/repositories/chat.repo'
import * as appointmentService from '@/services/appointment.service'
import * as callService from '@/services/call.service'
import * as chatService from '@/services/chat.service'
import { getRelatedUserIds } from '@/services/patientDoctor.service'
import { SOCKET_ROOMS, SYSTEM_EVENTS } from '@/sockets/socket.constants'

export const registerSystemHandler = (io) => {
  const systemNamespace = io.of('/system')

  systemNamespace.on('connection', async (socket) => {
    const user = socket.user
    console.log(`[System] Socket ${socket.id} (User: ${user.id}) connected.`)

    // Join room cá nhân tự động
    socket.join(SOCKET_ROOMS.SYSTEM.PERSONAL(user.id))

    // Lấy danh sách ID người dùng có liên quan (bác sĩ <-> bệnh nhân)
    const relatedIds = await getRelatedUserIds(user.id, user.role)

    // Cập nhật trạng thái vào Redis
    const wasOnline = await presenceCache.isUserOnline(user.id)
    await presenceCache.addSocket(user.id, socket.id)

    // Gia hạn TTL khi user vẫn đang kết nối
    const presenceRefreshTimer = setInterval(() => {
      void presenceCache.refreshTtl(user.id)
    }, presenceCache.PRESENCE_REFRESH_INTERVAL_MS)

    if (!wasOnline && relatedIds.length > 0) {
      relatedIds.forEach((targetId) => {
        // Chỉ phát event đến phòng cá nhân của những người có liên quan
        systemNamespace
          .to(SOCKET_ROOMS.SYSTEM.PERSONAL(targetId))
          .emit(SYSTEM_EVENTS.PRESENCE_ONLINE, { userId: user.id })
      })
    }

    /**
     * Lắng nghe Client xin vào phòng
     */
    socket.on(SYSTEM_EVENTS.ROOM_JOIN, (roomName) => {
      socket.join(roomName)
      console.log(`User ${user.id} joined room: ${roomName}`)
    })

    /**
     * Xử lý gửi cuộc gọi
     */
    socket.on(SYSTEM_EVENTS.CALL_INVITE, async (payload) => {
      const conversationId = payload?.conversationId
      const callLogId = payload?.callLogId
      if (!conversationId || callLogId == null) return

      try {
        await chatService.ensureConversationParticipant(user.id, conversationId)
        const callLog = await callService.assertUserCanUseCallLog(
          callLogId,
          user.id,
          conversationId,
        )

        // Nếu người gọi không phải là user hiện tại thì return
        if (Number(callLog.callerId) !== Number(user.id)) return

        // Nếu call log đã kết thúc (status !== null) thì return
        if (callLog.status !== null) return
      } catch (error) {
        return
      }

      // Lấy userId đối phương
      const peerUserId = await chatRepo.getPeerUserIdIfParticipant(
        user.id,
        conversationId,
      )
      if (!peerUserId) return

      const zegoRoomId = callService.buildZegoRoomId(conversationId, callLogId)

      // Lấy appointmentId từ payload (gửi kèm khi gọi từ appointment - người nhận fetch lịch theo id)
      let appointmentId
      const rawAppointmentId = payload?.appointmentId
      if (rawAppointmentId != null) {
        const parsed = Number(rawAppointmentId)
        if (Number.isFinite(parsed) && parsed > 0) {
          try {
            await appointmentService.assertAppointmentLinkedToCall(
              parsed,
              user.id,
              peerUserId,
            )
            appointmentId = parsed
          } catch {
            appointmentId = undefined
          }
        }
      }

      // Phát event đến phòng cá nhân của đối phương (người nhận cuộc gọi)
      systemNamespace
        .to(SOCKET_ROOMS.SYSTEM.PERSONAL(Number(peerUserId)))
        .emit(SYSTEM_EVENTS.CALL_INCOMING, {
          conversationId,
          zegoRoomId,
          callLogId: Number(callLogId),
          initiatorUserId: user.id,
          ...(appointmentId != null ? { appointmentId } : {}),
        })
    })

    /**
     * Xử lý chấp nhận cuộc gọi
     */
    socket.on(SYSTEM_EVENTS.CALL_ACCEPT, async (payload) => {
      const conversationId = payload?.conversationId
      const callLogId = payload?.callLogId
      if (!conversationId || callLogId == null) return

      try {
        await callService.acceptCallLog(user.id, conversationId, callLogId)
      } catch {
        return
      }

      const callLog = await CallLog.findByPk(Number(callLogId))
      if (!callLog) return

      // Phát event đến phòng cá nhân của người gọi
      systemNamespace
        .to(SOCKET_ROOMS.SYSTEM.PERSONAL(Number(callLog.callerId)))
        .emit(SYSTEM_EVENTS.CALL_ACCEPT, {
          conversationId,
          callLogId: Number(callLogId),
          acceptedByUserId: user.id,
        })
    })

    /**
     * Xử lý từ chối cuộc gọi
     */
    socket.on(SYSTEM_EVENTS.CALL_REJECT, async (payload) => {
      const conversationId = payload?.conversationId
      const callLogId = payload?.callLogId
      if (!conversationId || callLogId == null) return

      let callLog
      try {
        callLog = await callService.rejectCallLog(
          user.id,
          conversationId,
          callLogId,
        )
      } catch {
        return
      }

      // Phát event đến phòng cá nhân của người gọi
      systemNamespace
        .to(SOCKET_ROOMS.SYSTEM.PERSONAL(Number(callLog.callerId)))
        .emit(SYSTEM_EVENTS.CALL_REJECT, {
          conversationId,
          callLogId: Number(callLogId),
          fromUserId: user.id,
        })
    })

    /**
     * Xử lý kết thúc cuộc gọi
     */
    socket.on(SYSTEM_EVENTS.CALL_END, async (payload) => {
      const conversationId = payload?.conversationId
      const callLogId = payload?.callLogId
      if (!conversationId || callLogId == null) return

      const durationSeconds = payload?.durationSeconds

      let callLog
      try {
        callLog = await callService.endCallLog(
          user.id,
          conversationId,
          callLogId,
          durationSeconds,
        )
      } catch {
        return
      }

      const notifyUserId =
        Number(callLog.callerId) === Number(user.id)
          ? Number(callLog.receiverId)
          : Number(callLog.callerId)

      // Phát event đến phòng cá nhân của đối phương
      systemNamespace
        .to(SOCKET_ROOMS.SYSTEM.PERSONAL(notifyUserId))
        .emit(SYSTEM_EVENTS.CALL_END, {
          conversationId,
          callLogId: Number(callLogId),
          fromUserId: user.id,
        })
    })

    // Xử lý Disconnect
    socket.on('disconnect', async () => {
      console.log(`[System] Socket ${socket.id} disconnected.`)

      // Xóa timer gia hạn TTL
      clearInterval(presenceRefreshTimer)

      await presenceCache.removeSocket(user.id, socket.id)

      const isStillOnline = await presenceCache.isUserOnline(user.id)
      if (!isStillOnline && relatedIds.length > 0) {
        relatedIds.forEach((targetId) => {
          systemNamespace
            .to(SOCKET_ROOMS.SYSTEM.PERSONAL(targetId))
            .emit(SYSTEM_EVENTS.PRESENCE_OFFLINE, { userId: user.id })
        })
      }
    })
  })
}
