import type { Doctor } from '@/features/doctors/types'
import type { Patient } from '@/features/patients/types'

export type AlertStatus = 'pending' | 'handling' | 'resolved'

export interface Alert {
  id: number
  patientId: number
  deviceId: number
  type: string
  value: number
  message: string
  status: AlertStatus
  triggerTimestamp: string
  anomalyCount: number
  lastDetectedAt: string
  handledBy?: number // doctor ID
  resolvedAt?: string
  createdAt: string
  updatedAt: string
  patient?: Patient
  handledByDoctor?: Doctor
}
