import * as chatService from '@/services/chat.service'
import { CHAT_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'

export const registerChatHandler = (io) => {
  const chatNamespace = io.of('/chat')

  chatNamespace.on('connection', (socket) => {
    const userId = socket.user?.id
    console.log(`[Chat] Socket ${socket.id} (User: ${userId}) connected.`)

    // Xin vào phòng chat (Conversation Room)
    socket.on(CHAT_EVENTS.ROOM_JOIN, (roomName) => {
      socket.join(roomName)
      console.log(`User ${userId} joined chat room: ${roomName}`)
    })

    // Rời khỏi phòng chat
    socket.on(CHAT_EVENTS.ROOM_LEAVE, (roomName) => {
      socket.leave(roomName)
      console.log(`User ${userId} left chat room: ${roomName}`)
    })

    // Xử lý gửi tin nhắn
    socket.on(CHAT_EVENTS.MESSAGE_SEND, async (payload) => {
      // payload = { conversationId, text, ... }

      // (Tùy chọn) Bạn có thể gọi Service lưu tin nhắn vào MongoDB ở đây
      // const savedMessage = await ChatMessageService.save(payload);

      const roomName = SOCKET_ROOMS.CHAT.CONVERSATION(payload.conversationId)

      // Broadcast tin nhắn cho tat ca trong phong (bao gom tab khac)
      chatNamespace.to(roomName).emit(CHAT_EVENTS.MESSAGE_NEW, payload)
    })

    // Xác nhận đã đọc tin nhắn → cập nhật DB + relay cho người kia
    socket.on(CHAT_EVENTS.MESSAGE_READ, async (payload) => {
      const roomName = SOCKET_ROOMS.CHAT.CONVERSATION(payload.conversationId)

      try {
        // Cập nhật unread_counts trong DB
        await chatService.markAllMessagesAsRead(userId, payload.conversationId)
      } catch (err) {
        console.error('[Chat] markAllMessagesAsRead error:', err)
      }

      // Relay cho người kia trong phòng (socket.to = exclude sender)
      socket.to(roomName).emit(CHAT_EVENTS.MESSAGE_READ, payload)
    })

    // Trạng thái "Đang gõ..."
    socket.on(CHAT_EVENTS.TYPING_START, (conversationId) => {
      socket
        .to(SOCKET_ROOMS.CHAT.CONVERSATION(conversationId))
        .emit(CHAT_EVENTS.TYPING_START, { userId, conversationId })
    })

    socket.on(CHAT_EVENTS.TYPING_STOP, (conversationId) => {
      socket
        .to(SOCKET_ROOMS.CHAT.CONVERSATION(conversationId))
        .emit(CHAT_EVENTS.TYPING_STOP, { userId, conversationId })
    })

    socket.on('disconnect', () => {
      console.log(`[Chat] Socket ${socket.id} disconnected.`)
    })
  })
}
