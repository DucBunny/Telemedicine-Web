import { useEffect, useState } from 'react'
import { getSocket } from '@/lib/socket'

interface HealthData {
  deviceId: string
  bpm: number
  spo2: number
  hrv: number
  status: string
  prediction: {
    status: 'normal' | 'warning' | 'critical'
    confidence: number
    risk_score: number
  }
  timestamp: number
}

export const useHealthData = (patientId: number) => {
  const [healthData, setHealthData] = useState<Array<HealthData>>([])
  const [latestData, setLatestData] = useState<HealthData | null>(null)

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    let staleTimeout: number | null = null

    const onHealthData = (data: HealthData) => {
      setLatestData(data)
      setHealthData((prev) => [...prev.slice(-50), data]) // Keep last 50 points

      if (staleTimeout) clearTimeout(staleTimeout)

      staleTimeout = window.setTimeout(() => {
        setLatestData(null)
      }, 10000) // Clear latest data after 10 seconds of inactivity
    }

    socket.on('health:data', onHealthData)

    return () => {
      socket.off('health:data', onHealthData)
      if (staleTimeout) clearTimeout(staleTimeout)
    }
  }, [patientId])

  return { healthData, latestData }
}
