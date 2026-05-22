import { getIo } from '@/sockets/io.instance'
import { MONITOR_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'

/**
 * Stream gói ECG (187 điểm) tới phòng monitor của bệnh nhân
 */
export const emitEcgPacketToPatientMonitor = (patientId, payload) => {
  const io = getIo()
  if (!io) {
    console.warn(
      '[Monitor Emitter] io not initialized — cannot emit ecg packet',
    )
    return
  }

  const room = SOCKET_ROOMS.MONITOR.PATIENT(patientId)
  io.of('/monitor')
    .to(room)
    .emit(MONITOR_EVENTS.SENSOR_DATA_SYNC, {
      patientId,
      ...payload,
    })
}
