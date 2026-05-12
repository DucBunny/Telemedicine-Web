import * as presenceCache from '@/cache/presence.cache'
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

    if (!wasOnline && relatedIds.length > 0) {
      relatedIds.forEach((targetId) => {
        // Chỉ phát event đến phòng cá nhân của những người có liên quan
        systemNamespace
          .to(SOCKET_ROOMS.SYSTEM.PERSONAL(targetId))
          .emit(SYSTEM_EVENTS.PRESENCE_ONLINE, { userId: user.id })
      })
    }

    // Lắng nghe Client xin vào phòng
    socket.on(SYSTEM_EVENTS.ROOM_JOIN, (roomName) => {
      socket.join(roomName)
      console.log(`User ${user.id} joined room: ${roomName}`)
    })

    // Xử lý Disconnect
    socket.on('disconnect', async () => {
      console.log(`[System] Socket ${socket.id} disconnected.`)

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
