import * as patientDoctorRepo from '@/repositories/patientDoctor.repo'
import { MONITOR_EVENTS } from '@/sockets/socket.constants'

const PATIENT_ROOM_PREFIX = 'monitor:patient:'

/**
 * @param {string} roomName
 * @returns {{ patientId: number } | null}
 */
const parsePatientMonitorRoom = (roomName) => {
  if (
    typeof roomName !== 'string' ||
    !roomName.startsWith(PATIENT_ROOM_PREFIX)
  ) {
    return null
  }

  const patientId = Number.parseInt(
    roomName.slice(PATIENT_ROOM_PREFIX.length),
    10,
  )
  if (!Number.isFinite(patientId)) return null

  return { patientId }
}

/**
 * Bệnh nhân chỉ xem stream của chính mình; bác sĩ phải có quan hệ patient_doctors
 */
const canJoinPatientMonitor = async (user, patientId) => {
  if (!user?.id) return false

  if (user.role === 'patient') return user.id === patientId

  if (user.role === 'doctor')
    return await patientDoctorRepo.hasRelation(patientId, user.id)

  return false
}

export const registerMonitorHandler = (io) => {
  const monitorNamespace = io.of('/monitor')

  monitorNamespace.on('connection', (socket) => {
    const userId = socket.user?.id
    console.log(
      `[Monitor] Socket ${socket.id} connected (User: ${userId}, role: ${socket.user?.role}).`,
    )

    // Xử lý join room
    socket.on(MONITOR_EVENTS.ROOM_JOIN, async (roomName) => {
      // Kiểm tra room name có đúng format không
      const parsed = parsePatientMonitorRoom(roomName)
      if (!parsed) {
        socket.emit(MONITOR_EVENTS.ROOM_JOIN_REJECTED, {
          roomName,
          reason: 'INVALID_ROOM',
        })
        return
      }

      try {
        // Kiểm tra user có quyền vào room không
        const allowed = await canJoinPatientMonitor(
          socket.user,
          parsed.patientId,
        )
        if (!allowed) {
          socket.emit(MONITOR_EVENTS.ROOM_JOIN_REJECTED, {
            roomName,
            patientId: parsed.patientId,
            reason: 'FORBIDDEN',
          })
          console.warn(`[Monitor] User ${userId} denied join ${roomName}`)
          return
        }

        socket.join(roomName)
        console.log(`[Monitor] User ${userId} joined monitor room: ${roomName}`)
      } catch (error) {
        socket.emit(MONITOR_EVENTS.ROOM_JOIN_REJECTED, {
          roomName,
          reason: 'SERVER_ERROR',
        })
      }
    })

    // Xử lý rời khỏi room
    socket.on(MONITOR_EVENTS.ROOM_LEAVE, (roomName) => {
      socket.leave(roomName)
      console.log(`[Monitor] User ${userId} left monitor room: ${roomName}`)
    })

    // Xử lý Disconnect
    socket.on('disconnect', () => {
      console.log(`[Monitor] Socket ${socket.id} disconnected.`)
    })
  })
}
