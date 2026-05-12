import { io } from 'socket.io-client'
import { create } from 'zustand'

import type { Socket } from 'socket.io-client'
import type { Appointment } from '@/features/appointments/types'
import type { Notification } from '@/features/notifications/types'

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

/**
 * Tập hợp các callback lắng nghe notification mới từ systemSocket.
 * Dùng pattern subscriber set để tránh circular import giữa store và React hooks.
 */
const notificationSubscribers = new Set<NotificationCallback>()
const notificationReadSubscribers = new Set<NotificationReadCallback>()
const unreadCountSubscribers = new Set<UnreadCountCallback>()
const appointmentNewSubscribers = new Set<AppointmentCallback>()
const appointmentUpdateSubscribers = new Set<AppointmentCallback>()

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

interface SystemSocketStore {
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
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

    // Đảm bảo có token và user thì mới connect
    if (!accessToken || !user || get().socket?.connected) return

    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/system`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    // Kết nối socket thành công
    socket.on('connect', () => {
      console.log('[System Socket] Connected')
      set({ isConnected: true, socket })
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

    socket.on(SYSTEM_EVENTS.APPOINTMENT_NEW, (payload: AppointmentPayload) => {
      appointmentNewSubscribers.forEach((cb) => cb(payload))
    })

    socket.on(
      SYSTEM_EVENTS.APPOINTMENT_UPDATE,
      (payload: AppointmentPayload) => {
        appointmentUpdateSubscribers.forEach((cb) => cb(payload))
      },
    )

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
}))
