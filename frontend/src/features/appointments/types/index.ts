import type { Doctor } from '@/features/doctors/types'
import type { Patient } from '@/features/patients/types'

export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'upcoming'
  | 'completed'
  | 'cancelled'

export type AppointmentType = 'offline' | 'online'

export interface Appointment {
  id: number
  patientId: number
  doctorId: number
  scheduledAt: string
  actualEndedAt: string | null
  durationMinutes: number
  status: AppointmentStatus
  type: AppointmentType
  meetingLink: string
  reason: string
  cancelReason: string | null
  createdAt: string
  updatedAt: string
  doctor?: Doctor
  patient?: Patient
}

export interface TimeSlot {
  time: string
  isAvailable: boolean
}
