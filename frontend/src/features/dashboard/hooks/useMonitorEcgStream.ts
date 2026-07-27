import { useEffect, useRef, useState } from 'react'

import {
  addMonitorEcgListener,
  addMonitorJoinRejectedListener,
  useMonitorSocketStore,
} from '@/stores/monitorSocket.store'

export interface UseMonitorEcgStreamOptions {
  patientId?: number
  enabled?: boolean
  onPacket?: (packet: {
    packetEcg: Array<number>
    classInference: string | null
    timeInference: number | null
    inferenceReady?: boolean
    inferenceConfidence?: number | null
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
  const ecgPacketSize = Number(import.meta.env.VITE_ECG_PACKET_SIZE)
  const hasValidPacketSize = Number.isFinite(ecgPacketSize) && ecgPacketSize > 0

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
        (hasValidPacketSize && payload.packetEcg.length !== ecgPacketSize)
      ) {
        return
      }

      onPacketRef.current?.({
        packetEcg: payload.packetEcg,
        classInference: payload.classInference ?? null,
        timeInference: payload.timeInference ?? null,
        inferenceReady: payload.inferenceReady,
        inferenceConfidence: payload.inferenceConfidence ?? null,
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
