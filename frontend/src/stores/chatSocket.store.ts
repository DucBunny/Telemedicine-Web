import { io } from 'socket.io-client'
import { create } from 'zustand'

import type { Socket } from 'socket.io-client'
import type {
  ChatReadEvent,
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
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  sendTypingStart: (conversationId: string) => void
  sendTypingStop: (conversationId: string) => void
  sendReadEvent: (conversationId: string) => void
}

type MessageCallback = (payload: SocketChatMessage) => void
type TypingCallback = (payload: ChatTypingEvent) => void
type ReadCallback = (payload: ChatReadEvent) => void

const messageSubscribers = new Set<MessageCallback>()
const typingStartSubscribers = new Set<TypingCallback>()
const typingStopSubscribers = new Set<TypingCallback>()
const readSubscribers = new Set<ReadCallback>()

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
    if (!accessToken || get().socket?.connected) return

    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    // Kết nối socket thành công
    socket.on('connect', () => {
      set({ isConnected: true, socket })

      const { activeConversationId } = get()
      if (activeConversationId) {
        const room = SOCKET_ROOMS.CHAT.CONVERSATION(activeConversationId)
        socket.emit(CHAT_EVENTS.ROOM_JOIN, room)
      }
    })

    socket.on(CHAT_EVENTS.MESSAGE_NEW, (payload: SocketChatMessage) => {
      messageSubscribers.forEach((cb) => cb(payload))
    })

    socket.on(CHAT_EVENTS.TYPING_START, (payload: ChatTypingEvent) => {
      typingStartSubscribers.forEach((cb) => cb(payload))
    })

    socket.on(CHAT_EVENTS.TYPING_STOP, (payload: ChatTypingEvent) => {
      typingStopSubscribers.forEach((cb) => cb(payload))
    })

    socket.on(CHAT_EVENTS.MESSAGE_READ, (payload: ChatReadEvent) => {
      readSubscribers.forEach((cb) => cb(payload))
    })

    // Ngắt kết nối socket thành công hoặc do lỗi
    socket.on('disconnect', () => set({ isConnected: false }))
  },

  // Ngắt kết nối socket
  disconnect: () => {
    get().socket?.disconnect()
    set({ socket: null, isConnected: false, activeConversationId: null })
  },

  // Vào conversation
  joinConversation: (conversationId) => {
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
  leaveConversation: (conversationId) => {
    const { socket } = get()
    if (socket) {
      const room = SOCKET_ROOMS.CHAT.CONVERSATION(conversationId)
      socket.emit(CHAT_EVENTS.ROOM_LEAVE, room)
    }
    set({ activeConversationId: null })
  },

  sendTypingStart: (conversationId) => {
    const { socket } = get()
    if (socket) socket.emit(CHAT_EVENTS.TYPING_START, conversationId)
  },

  sendTypingStop: (conversationId) => {
    const { socket } = get()
    if (socket) socket.emit(CHAT_EVENTS.TYPING_STOP, conversationId)
  },

  sendReadEvent: (conversationId) => {
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
