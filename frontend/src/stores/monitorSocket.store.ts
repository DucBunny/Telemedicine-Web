import { io } from 'socket.io-client'
import { create } from 'zustand'

import type { Socket } from 'socket.io-client'
import type {
  MonitorEcgSyncPayload,
  MonitorJoinRejectedPayload,
} from '@/sockets/socket.types'

import { MONITOR_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'
import { useAuthStore } from '@/stores/auth.store'

interface MonitorSocketStore {
  socket: Socket | null
  isConnected: boolean
  activePatientId: number | null
  connect: () => void
  disconnect: () => void
  emitJoinPatientMonitor: (patientId: number) => void
  emitLeavePatientMonitor: (patientId: number) => void
}

type EcgPacketCallback = (payload: MonitorEcgSyncPayload) => void
type JoinRejectedCallback = (payload: MonitorJoinRejectedPayload) => void

const ecgPacketSubscribers = new Set<EcgPacketCallback>()
const joinRejectedSubscribers = new Set<JoinRejectedCallback>()

export const addMonitorEcgListener = (cb: EcgPacketCallback) => {
  ecgPacketSubscribers.add(cb)
  return () => ecgPacketSubscribers.delete(cb)
}

export const addMonitorJoinRejectedListener = (cb: JoinRejectedCallback) => {
  joinRejectedSubscribers.add(cb)
  return () => joinRejectedSubscribers.delete(cb)
}

/**
 * Zustand store để quản lý state của Monitor Socket
 * - socket: Socket instance
 * - isConnected: Trạng thái kết nối
 * - activePatientId: ID của patient hiện tại
 */
export const useMonitorSocketStore = create<MonitorSocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  activePatientId: null,

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

    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/monitor`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    set({ socket, isConnected: false })

    // Kết nối socket thành công
    socket.on('connect', () => {
      set({ isConnected: true })

      const { activePatientId } = get()
      if (activePatientId) {
        const room = SOCKET_ROOMS.MONITOR.PATIENT(activePatientId)
        socket.emit(MONITOR_EVENTS.ROOM_JOIN, room)
      }
    })

    // Nhận sự kiện gói ECG từ MQTT → broadcast đến tất cả subscribers
    socket.on(
      MONITOR_EVENTS.SENSOR_DATA_SYNC,
      (payload: MonitorEcgSyncPayload) => {
        ecgPacketSubscribers.forEach((cb) => cb(payload))
      },
    )

    // Nhận sự kiện từ chối vào monitor → broadcast đến tất cả subscribers
    socket.on(
      MONITOR_EVENTS.ROOM_JOIN_REJECTED,
      (payload: MonitorJoinRejectedPayload) => {
        joinRejectedSubscribers.forEach((cb) => cb(payload))
      },
    )

    // Ngắt kết nối socket thành công hoặc do lỗi
    socket.on('disconnect', () => set({ isConnected: false }))
  },

  // Ngắt kết nối socket
  disconnect: () => {
    get().socket?.disconnect()
    set({ socket: null, isConnected: false, activePatientId: null })
  },

  // Vào monitor
  emitJoinPatientMonitor: (patientId) => {
    const { socket, activePatientId } = get()

    // Rời phòng cũ bằng cấu trúc Nested
    if (activePatientId && activePatientId !== patientId && socket) {
      const oldRoom = SOCKET_ROOMS.MONITOR.PATIENT(activePatientId)
      socket.emit(MONITOR_EVENTS.ROOM_LEAVE, oldRoom)
    }

    // Vào phòng mới
    const room = SOCKET_ROOMS.MONITOR.PATIENT(patientId)
    if (socket?.connected) {
      socket.emit(MONITOR_EVENTS.ROOM_JOIN, room)
    }

    set({ activePatientId: patientId })
  },

  // Rời khỏi monitor
  emitLeavePatientMonitor: (patientId) => {
    const { socket, activePatientId } = get()
    if (socket && activePatientId === patientId) {
      const room = SOCKET_ROOMS.MONITOR.PATIENT(patientId)
      socket.emit(MONITOR_EVENTS.ROOM_LEAVE, room)
      set({ activePatientId: null })
    }
  },
}))
