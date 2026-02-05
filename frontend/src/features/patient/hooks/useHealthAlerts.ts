import { useEffect, useState } from 'react'
import { getSocket } from '@/lib/socket'

interface HealthAlert {
  severity: 'warning' | 'critical'
  message: string
  deviceId: string
  timestamp: number
  riskScore?: number
}

export const useHealthAlerts = () => {
  const [alerts, setAlerts] = useState<Array<HealthAlert>>([])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on('health:alert', (alert: HealthAlert) => {
      console.log('Received alert:', alert)

      setAlerts((prev) => [alert, ...prev])

      // Show toast notification
      if (alert.severity === 'critical') {
        // showCriticalAlert(alert)
      }
    })

    return () => {
      socket.off('health:alert')
    }
  }, [])

  return { alerts }
}
