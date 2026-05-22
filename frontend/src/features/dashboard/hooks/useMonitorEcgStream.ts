import { useEffect, useRef, useState } from 'react'

import {
  addMonitorEcgListener,
  addMonitorJoinRejectedListener,
  useMonitorSocketStore,
} from '@/stores/monitorSocket.store'

const ECG_PACKET_SIZE = 187

export interface UseMonitorEcgStreamOptions {
  patientId?: number
  enabled?: boolean
  onPacket?: (packet: {
    packetEcg: Array<number>
    classInference: string
    timeInference: number | null
  }) => void
}

/**
 * Join phòng monitor:patient:{id} và nhận gói ECG từ MQTT → socket
 */
export const useMonitorEcgStream = ({
  patientId,
  enabled = true,
  onPacket,
}: UseMonitorEcgStreamOptions) => {
  const onPacketRef = useRef(onPacket)
  onPacketRef.current = onPacket

  const {
    connect,
    disconnect,
    emitJoinPatientMonitor,
    emitLeavePatientMonitor,
    isConnected,
  } = useMonitorSocketStore()
  const [joinError, setJoinError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !patientId) return

    connect()
    setJoinError(null)
    emitJoinPatientMonitor(patientId)

    const unsubscribeRejected = addMonitorJoinRejectedListener((payload) => {
      if (payload.patientId != null && payload.patientId !== patientId) {
        return
      }
      setJoinError(
        payload.reason === 'FORBIDDEN'
          ? 'Bạn không có quyền xem dữ liệu monitor của bệnh nhân này'
          : 'Không thể tham gia phòng monitor',
      )
    })

    const unsubscribe = addMonitorEcgListener((payload) => {
      if (payload.patientId !== patientId) return
      if (
        !Array.isArray(payload.packetEcg) ||
        payload.packetEcg.length !== ECG_PACKET_SIZE
      ) {
        return
      }

      onPacketRef.current?.({
        packetEcg: payload.packetEcg,
        classInference: payload.classInference,
        timeInference: payload.timeInference ?? null,
      })
    })

    return () => {
      unsubscribeRejected()
      unsubscribe()
      emitLeavePatientMonitor(patientId)
      disconnect()
    }
  }, [
    enabled,
    patientId,
    connect,
    disconnect,
    emitJoinPatientMonitor,
    emitLeavePatientMonitor,
  ])

  return { isConnected, joinError }
}
