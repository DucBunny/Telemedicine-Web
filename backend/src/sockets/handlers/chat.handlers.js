import * as chatService from '@/services/chat.service'
import { CHAT_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'

const CONVERSATION_ROOM_PREFIX = 'conversation:'

/**
 * Parse conversation room name
 * @param {string} roomName
 * @returns {Object} { conversationId }
 */
const parseConversationRoom = (roomName) => {
  if (
    typeof roomName !== 'string' ||
    !roomName.startsWith(CONVERSATION_ROOM_PREFIX)
  )
    return null

  return { conversationId: roomName.slice(CONVERSATION_ROOM_PREFIX.length) }
}

export const registerChatHandler = (io) => {
  const chatNamespace = io.of('/chat')

  chatNamespace.on('connection', (socket) => {
    const userId = socket.user?.id
    console.log(`[Chat] Socket ${socket.id} (User: ${userId}) connected.`)

    // Xử lý join room
    socket.on(CHAT_EVENTS.ROOM_JOIN, async (roomName) => {
      // Kiểm tra room name có đúng format không
      const parsed = parseConversationRoom(roomName)
      if (!parsed) {
        socket.emit(CHAT_EVENTS.ROOM_JOIN_REJECTED, {
          roomName,
          reason: 'INVALID_ROOM',
        })
        return
      }

      try {
        // Đảm bảo user là participant của conversation
        await chatService.ensureConversationParticipant(
          userId,
          parsed.conversationId,
        )
        socket.join(roomName)
        console.log(`User ${userId} joined chat room: ${roomName}`)
      } catch {
        socket.emit(CHAT_EVENTS.ROOM_JOIN_REJECTED, {
          conversationId: parsed.conversationId,
          reason: 'NOT_PARTICIPANT',
        })
      }
    })

    // Rời khỏi phòng chat
    socket.on(CHAT_EVENTS.ROOM_LEAVE, (roomName) => {
      socket.leave(roomName)
      console.log(`User ${userId} left chat room: ${roomName}`)
    })

    // Xử lý gửi tin nhắn
    socket.on(CHAT_EVENTS.MESSAGE_SEND, async (payload) => {
      const roomName = SOCKET_ROOMS.CHAT.CONVERSATION(payload.conversationId)

      // Broadcast tin nhắn cho tất cả trong phòng (bao gồm tab khác)
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
