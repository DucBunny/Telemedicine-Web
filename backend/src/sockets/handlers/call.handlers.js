import { CALL_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'

export const registerCallHandler = (io) => {
  const callNamespace = io.of('/call')

  callNamespace.on('connection', (socket) => {
    console.log(`[Call] Socket ${socket.id} connected.`)

    // Join vào phòng gọi chung (Dựa trên callId)
    socket.on(CALL_EVENTS.ROOM_JOIN, (roomName) => {
      socket.join(roomName)
    })

    // Trao đổi WebRTC Offer (Người gọi bắt đầu)
    socket.on(CALL_EVENTS.WEBRTC_OFFER, (payload) => {
      // payload = { callId, offer: SDP_Object }
      const roomName = SOCKET_ROOMS.CALL.SESSION(payload.callId)
      socket.to(roomName).emit(CALL_EVENTS.WEBRTC_OFFER_RECEIVED, payload)
    })

    // Trao đổi WebRTC Answer (Người nghe trả lời)
    socket.on(CALL_EVENTS.WEBRTC_ANSWER, (payload) => {
      const roomName = SOCKET_ROOMS.CALL.SESSION(payload.callId)
      socket.to(roomName).emit(CALL_EVENTS.WEBRTC_ANSWER_RECEIVED, payload)
    })

    // Trao đổi ICE Candidates (Tọa độ mạng)
    socket.on(CALL_EVENTS.WEBRTC_ICE_CANDIDATE, (payload) => {
      const roomName = SOCKET_ROOMS.CALL.SESSION(payload.callId)
      socket.to(roomName).emit(CALL_EVENTS.WEBRTC_ICE_RECEIVED, payload)
    })

    // Ngắt cuộc gọi (Cúp máy)
    socket.on(CALL_EVENTS.END, (payload) => {
      const roomName = SOCKET_ROOMS.CALL.SESSION(payload.callId)
      // Báo cho người kia biết để đóng giao diện
      socket.to(roomName).emit(CALL_EVENTS.ENDED, payload)
    })

    socket.on('disconnect', () => {
      console.log(`[Call] Socket ${socket.id} disconnected.`)
      // (Xử lý rớt mạng giữa chừng nếu cần)
    })
  })
}
