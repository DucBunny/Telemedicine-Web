import type { User } from '../../admin/api/user.api'

export interface VitalSign {
  id: number
  label: string
  value: string
  unit: string
  status: 'normal' | 'warning' | 'critical'
  icon: React.ComponentType<any>
  color: string
  bg: string
  description: string
}

export interface Notification {
  id: number
  title: string
  content: string
  time: string
  is_read: boolean
  type: 'appointment' | 'alert' | 'chat' | 'general'
}

// --------------------------------------------------------------------
export interface Device {
  deviceId: number
  deviceName: string
  deviceType: string
  status: string
  lastSync: string
}

export interface Appointment {
  id: number
  patientId: number
  doctorId: number
  scheduledAt: string
  endedAt: string | null
  status: string
  meetingLink: string
  reason: string
  cancelReason: string | null
  createdAt: string
  updatedAt: string
  doctor?: Doctor
  patient?: Patient
}

export interface Doctor {
  userId: number
  specialization: string
  degree: string
  experienceYears: number
  bio: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface Patient {
  userId: number
  dateOfBirth: string
  gender: string
  bloodType: string
  height: number
  weight: number
  medicalHistory: string
  address: string
  currentHealthStatus: string
  currentIssue: string | null
  lastAlertAt: string | null
  createdAt: string
  updatedAt: string
  user: User
}

export interface MedicalRecord {
  id: number
  patientId: number
  doctorId: number
  diagnosis: string
  prescription: string
  notes: string
  visitDate: string
  createdAt: string
  updatedAt: string
  doctor?: Doctor
  patient?: Patient
}
