import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

let socket: Socket | null = null

/**
 * Initialize socket
 */
export const initSocket = (patientId?: number) => {
  if (socket) return socket

  socket = io(import.meta.env.VITE_API_URL.replace('/api-v1', ''), {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)

    // Join patient room nếu là patient
    if (patientId) {
      socket?.emit('join:patient', patientId)
    }
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  return socket
}

/**
 * Get socket instance
 */
export const getSocket = () => socket

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect()
    socket = null
  }
}
