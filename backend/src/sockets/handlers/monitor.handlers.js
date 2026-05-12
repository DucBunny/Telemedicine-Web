import { MONITOR_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'

export const registerMonitorHandler = (io) => {
  const monitorNamespace = io.of('/monitor')

  monitorNamespace.on('connection', (socket) => {
    // Có thể là Bác sĩ (xem) hoặc Thiết bị IoT (đẩy)
    console.log(`[Monitor] Socket ${socket.id} connected.`)

    // 1. Bác sĩ xin vào phòng của 1 Bệnh nhân để xem data
    socket.on(MONITOR_EVENTS.ROOM_JOIN, (roomName) => {
      socket.join(roomName)
      console.log(`Doctor joined monitor room: ${roomName}`)
    })

    // Bác sĩ rời đi không xem nữa
    socket.on(MONITOR_EVENTS.ROOM_LEAVE, (roomName) => {
      socket.leave(roomName)
    })

    // 2. Thiết bị IoT / Mobile App đẩy dữ liệu ECG, Nhịp tim lên
    socket.on(MONITOR_EVENTS.SENSOR_PUSH_DATA, (payload) => {
      // payload = { patientId, bpm, spo2, ecgArray: [...] }

      const roomName = SOCKET_ROOMS.MONITOR.PATIENT(payload.patientId)

      // (Tùy chọn) Đẩy vào Buffer/Queue để bulk-insert vào MongoDB sau
      // để tránh sập DB vì query quá nhiều.

      // Phát (Stream) dữ liệu ngay lập tức xuống cho tất cả bác sĩ đang join phòng này
      socket.to(roomName).emit(MONITOR_EVENTS.SENSOR_DATA_SYNC, payload)
    })

    socket.on('disconnect', () => {
      console.log(`🔴 [Monitor] Socket ${socket.id} disconnected.`)
    })
  })
}
