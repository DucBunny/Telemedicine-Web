import { io } from 'socket.io-client'
import { create } from 'zustand'

import type { Socket } from 'socket.io-client'
import type { Appointment } from '@/features/appointments/types'
import type { Notification } from '@/features/notifications/types'
import type {
  CallIncomingPayload,
  CallPeerPayload,
} from '@/sockets/socket.types'

import { SYSTEM_EVENTS } from '@/sockets/socket.constants'
import { useAuthStore } from '@/stores/auth.store'
import { usePresenceStore } from '@/stores/presence.store'

type NotificationCallback = (notification: Notification) => void
type NotificationReadCallback = (payload: { id: number }) => void
type UnreadCountCallback = (payload: { count: number }) => void
type AppointmentPayload = Pick<
  Appointment,
  'id' | 'status' | 'scheduledAt' | 'doctorId' | 'patientId' | 'type'
>
type AppointmentCallback = (payload: AppointmentPayload) => void
type CallIncomingCallback = (payload: CallIncomingPayload) => void
type CallPeerCallback = (payload: CallPeerPayload) => void

/**
 * Tập hợp các callback lắng nghe notification mới từ systemSocket.
 * Dùng pattern subscriber set để tránh circular import giữa store và React hooks.
 */
const notificationSubscribers = new Set<NotificationCallback>()
const notificationReadSubscribers = new Set<NotificationReadCallback>()
const unreadCountSubscribers = new Set<UnreadCountCallback>()
const appointmentNewSubscribers = new Set<AppointmentCallback>()
const appointmentUpdateSubscribers = new Set<AppointmentCallback>()
const callIncomingSubscribers = new Set<CallIncomingCallback>()
const callPeerRejectedSubscribers = new Set<CallPeerCallback>()
const callPeerEndedSubscribers = new Set<CallPeerCallback>()

export const addNotificationListener = (cb: NotificationCallback) => {
  notificationSubscribers.add(cb)
  return () => notificationSubscribers.delete(cb)
}

export const addNotificationReadListener = (cb: NotificationReadCallback) => {
  notificationReadSubscribers.add(cb)
  return () => notificationReadSubscribers.delete(cb)
}

export const addUnreadCountListener = (cb: UnreadCountCallback) => {
  unreadCountSubscribers.add(cb)
  return () => unreadCountSubscribers.delete(cb)
}

export const addAppointmentNewListener = (cb: AppointmentCallback) => {
  appointmentNewSubscribers.add(cb)
  return () => appointmentNewSubscribers.delete(cb)
}

export const addAppointmentUpdateListener = (cb: AppointmentCallback) => {
  appointmentUpdateSubscribers.add(cb)
  return () => appointmentUpdateSubscribers.delete(cb)
}

export const addCallIncomingListener = (cb: CallIncomingCallback) => {
  callIncomingSubscribers.add(cb)
  return () => callIncomingSubscribers.delete(cb)
}

export const addCallPeerRejectedListener = (cb: CallPeerCallback) => {
  callPeerRejectedSubscribers.add(cb)
  return () => callPeerRejectedSubscribers.delete(cb)
}

export const addCallPeerEndedListener = (cb: CallPeerCallback) => {
  callPeerEndedSubscribers.add(cb)
  return () => callPeerEndedSubscribers.delete(cb)
}

interface SystemSocketStore {
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  emitCallInvite: (
    conversationId: string,
    callLogId: number,
    appointmentId?: number,
  ) => void
  emitCallAccept: (conversationId: string, callLogId: number) => void
  emitCallReject: (conversationId: string, callLogId: number) => void
  emitCallEnd: (
    conversationId: string,
    callLogId: number,
    durationSeconds?: number,
  ) => void
}

/**
 * Store để quản lý kết nối Socket hệ thống
 * - socket: Socket instance
 * - isConnected: Trạng thái kết nối
 */
export const useSystemSocketStore = create<SystemSocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  // Kết nối socket
  connect: () => {
    const { accessToken, user } = useAuthStore.getState()

    if (!accessToken || !user) return

    // Xử lý kết nối socket
    const prev = get().socket
    if (prev?.connected) return
    if (prev) {
      prev.disconnect()
      set({ socket: null, isConnected: false })
    }

    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/system`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    // Gán socket sớm để emit (kể cả trước khi `connect`) không bị `get().socket === null`
    set({ socket, isConnected: false })

    socket.on('connect', () => {
      console.log('[System Socket] Connected')
      set({ isConnected: true })
    })

    // Nhận sự kiện user online
    socket.on(SYSTEM_EVENTS.PRESENCE_ONLINE, ({ userId }) => {
      usePresenceStore.getState().setOnline(userId)
    })

    // Nhận sự kiện user offline
    socket.on(SYSTEM_EVENTS.PRESENCE_OFFLINE, ({ userId }) => {
      usePresenceStore.getState().setOffline(userId)
    })

    // Nhận thông báo mới từ server → broadcast đến tất cả subscribers
    socket.on(SYSTEM_EVENTS.NOTIFICATION_NEW, (notification: Notification) => {
      notificationSubscribers.forEach((cb) => cb(notification))
    })

    // Nhận sự kiện notification đã đọc → broadcast đến tất cả subscribers
    socket.on(SYSTEM_EVENTS.NOTIFICATION_READ, (payload: { id: number }) => {
      notificationReadSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện cập nhật số lượng notification chưa đọc → broadcast đến tất cả subscribers
    socket.on(
      SYSTEM_EVENTS.NOTIFICATION_UNREAD_COUNT_UPDATE,
      (payload: { count: number }) => {
        unreadCountSubscribers.forEach((cb) => cb(payload))
      },
    )

    // Nhận sự kiện lịch hẹn mới → broadcast đến tất cả subscribers
    socket.on(SYSTEM_EVENTS.APPOINTMENT_NEW, (payload: AppointmentPayload) => {
      appointmentNewSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện lịch hẹn cập nhật → broadcast đến tất cả subscribers
    socket.on(
      SYSTEM_EVENTS.APPOINTMENT_UPDATE,
      (payload: AppointmentPayload) => {
        appointmentUpdateSubscribers.forEach((cb) => cb(payload))
      },
    )

    // Nhận sự kiện cuộc gọi đến → broadcast đến tất cả subscribers
    socket.on(SYSTEM_EVENTS.CALL_INCOMING, (payload: CallIncomingPayload) => {
      callIncomingSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện từ chối cuộc gọi → broadcast đến tất cả subscribers
    socket.on(SYSTEM_EVENTS.CALL_REJECT, (payload: CallPeerPayload) => {
      callPeerRejectedSubscribers.forEach((cb) => cb(payload))
    })

    // Nhận sự kiện kết thúc cuộc gọi → broadcast đến tất cả subscribers
    socket.on(SYSTEM_EVENTS.CALL_END, (payload: CallPeerPayload) => {
      callPeerEndedSubscribers.forEach((cb) => cb(payload))
    })

    // Ngắt kết nối socket thành công hoặc do lỗi (người dùng đóng tab, mất kết nối)
    socket.on('disconnect', () => {
      console.log('[System Socket] Disconnected')
      set({ isConnected: false })
    })
  },

  // Ngắt kết nối socket
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  // Gửi sự kiện gửi cuộc gọi
  emitCallInvite: (conversationId, callLogId, appointmentId) => {
    const { socket } = get()
    if (!socket) return
    const payload: {
      conversationId: string
      callLogId: number
      appointmentId?: number
    } = { conversationId, callLogId }
    if (appointmentId != null && Number.isFinite(appointmentId)) {
      payload.appointmentId = appointmentId
    }
    socket.emit(SYSTEM_EVENTS.CALL_INVITE, payload)
  },

  // Gửi sự kiện chấp nhận cuộc gọi
  emitCallAccept: (conversationId, callLogId) => {
    const { socket } = get()
    if (socket)
      socket.emit(SYSTEM_EVENTS.CALL_ACCEPT, { conversationId, callLogId })
  },

  // Gửi sự kiện từ chối cuộc gọi
  emitCallReject: (conversationId, callLogId) => {
    const { socket } = get()
    if (socket)
      socket.emit(SYSTEM_EVENTS.CALL_REJECT, { conversationId, callLogId })
  },

  // Gửi sự kiện kết thúc cuộc gọi
  emitCallEnd: (conversationId, callLogId, durationSeconds = 0) => {
    const { socket } = get()
    if (socket)
      socket.emit(SYSTEM_EVENTS.CALL_END, {
        conversationId,
        callLogId,
        durationSeconds,
      })
  },
}))
