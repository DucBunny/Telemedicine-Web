import { io } from 'socket.io-client'
import { create } from 'zustand'

import type { Socket } from 'socket.io-client'
import type {
  ChatReadEvent,
  ChatRoomJoinRejectedPayload,
  ChatTypingEvent,
  SocketChatMessage,
} from '@/sockets/socket.types'

import { CHAT_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'
import { useAuthStore } from '@/stores/auth.store'

interface ChatSocketStore {
  socket: Socket | null
  isConnected: boolean
  activeConversationId: string | null
  connect: () => void
  disconnect: () => void
  emitJoinConversation: (conversationId: string) => void
  emitLeaveConversation: (conversationId: string) => void
  emitTypingStart: (conversationId: string) => void
  emitTypingStop: (conversationId: string) => void
  emitReadEvent: (conversationId: string) => void
}

type MessageCallback = (payload: SocketChatMessage) => void
type TypingCallback = (payload: ChatTypingEvent) => void
type ReadCallback = (payload: ChatReadEvent) => void
type RoomJoinRejectedCallback = (payload: ChatRoomJoinRejectedPayload) => void

const messageSubscribers = new Set<MessageCallback>()
const typingStartSubscribers = new Set<TypingCallback>()
const typingStopSubscribers = new Set<TypingCallback>()
const readSubscribers = new Set<ReadCallback>()
const roomJoinRejectedSubscribers = new Set<RoomJoinRejectedCallback>()

export const addChatMessageListener = (cb: MessageCallback) => {
  messageSubscribers.add(cb)
  return () => messageSubscribers.delete(cb)
}

export const addChatTypingStartListener = (cb: TypingCallback) => {
  typingStartSubscribers.add(cb)
  return () => typingStartSubscribers.delete(cb)
}

export const addChatTypingStopListener = (cb: TypingCallback) => {
  typingStopSubscribers.add(cb)
  return () => typingStopSubscribers.delete(cb)
}

export const addChatReadListener = (cb: ReadCallback) => {
  readSubscribers.add(cb)
  return () => readSubscribers.delete(cb)
}

export const addChatRoomJoinRejectedListener = (
  cb: RoomJoinRejectedCallback,
) => {
  roomJoinRejectedSubscribers.add(cb)
  return () => roomJoinRejectedSubscribers.delete(cb)
}

/**
 * Zustand store để quản lý state của Chat Socket
 * - socket: Socket instance
 * - isConnected: Trạng thái kết nối
 * - activeConversationId: ID của conversation hiện tại
 */
export const useChatSocketStore = create<ChatSocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  activeConversationId: null,

  // Kết nối socket
  connect: () => {
    const { accessToken } = useAuthStore.getState()
    if (!accessToken) return

    // Xử lý kết nối socket
    const prev = get().socket
    if (prev?.connected) return
    if (prev) {
      prev.disconnect()
      set({ socket: null, isConnected: false })
    }

    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    // Gán socket sớm để emit (kể cả trước khi `connect`) không bị `get().socket === null`
    set({ socket, isConnected: false })

    // Kết nối socket thành công
    socket.on('connect', () => {
      set({ isConnected: true })

      const { activeConversationId } = get()
      if (activeConversationId) {
        const room = SOCKET_ROOMS.CHAT.CONVERSATION(activeConversationId)
        socket.emit(CHAT_EVENTS.ROOM_JOIN, room)
      }
    })

    // Nhận sự kiện tin nhắn mới → broadcast đến tất cả subscribers
    socket.on(CHAT_EVENTS.MESSAGE_NEW, (payload: SocketChatMessage) => {
      messageSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện đang gõ → broadcast đến tất cả subscribers
    socket.on(CHAT_EVENTS.TYPING_START, (payload: ChatTypingEvent) => {
      typingStartSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện đã ngừng gõ → broadcast đến tất cả subscribers
    socket.on(CHAT_EVENTS.TYPING_STOP, (payload: ChatTypingEvent) => {
      typingStopSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện đã đọc tin nhắn → broadcast đến tất cả subscribers
    socket.on(CHAT_EVENTS.MESSAGE_READ, (payload: ChatReadEvent) => {
      readSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện đã từ chối vào conversation → broadcast đến tất cả subscribers
    socket.on(
      CHAT_EVENTS.ROOM_JOIN_REJECTED,
      (payload: ChatRoomJoinRejectedPayload) => {
        roomJoinRejectedSubscribers.forEach((cb) => cb(payload))
      },
    )

    // Ngắt kết nối socket thành công hoặc do lỗi
    socket.on('disconnect', () => set({ isConnected: false }))
  },

  // Ngắt kết nối socket
  disconnect: () => {
    get().socket?.disconnect()
    set({ socket: null, isConnected: false, activeConversationId: null })
  },

  // Vào conversation
  emitJoinConversation: (conversationId) => {
    const { socket, activeConversationId } = get()
    if (!socket) {
      set({ activeConversationId: conversationId })
      return
    }

    // Rời phòng cũ bằng cấu trúc Nested
    if (activeConversationId && activeConversationId !== conversationId) {
      const oldRoom = SOCKET_ROOMS.CHAT.CONVERSATION(activeConversationId)
      socket.emit(CHAT_EVENTS.ROOM_LEAVE, oldRoom)
    }

    // Vào phòng mới
    const newRoom = SOCKET_ROOMS.CHAT.CONVERSATION(conversationId)
    socket.emit(CHAT_EVENTS.ROOM_JOIN, newRoom)
    set({ activeConversationId: conversationId })
  },

  // Rời khỏi conversation
  emitLeaveConversation: (conversationId) => {
    const { socket } = get()
    if (socket) {
      const room = SOCKET_ROOMS.CHAT.CONVERSATION(conversationId)
      socket.emit(CHAT_EVENTS.ROOM_LEAVE, room)
    }
    set({ activeConversationId: null })
  },

  // Gửi sự kiện đang gõ
  emitTypingStart: (conversationId) => {
    const { socket } = get()
    if (socket) socket.emit(CHAT_EVENTS.TYPING_START, conversationId)
  },

  // Gửi sự kiện đã ngừng gõ
  emitTypingStop: (conversationId) => {
    const { socket } = get()
    if (socket) socket.emit(CHAT_EVENTS.TYPING_STOP, conversationId)
  },

  // Gửi sự kiện đã đọc tin nhắn
  emitReadEvent: (conversationId) => {
    const { socket } = get()
    const userId = useAuthStore.getState().user?.id
    if (socket)
      socket.emit(CHAT_EVENTS.MESSAGE_READ, {
        conversationId,
        readerId: userId,
        messageIds: [],
        timestamp: Date.now(),
      })
  },
}))
