import type { User } from '../../admin/api/user.api'

export type StatusType =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'completed'
  | 'normal'
  | 'warning'
  | 'critical'
  | 'low'
  | 'medium'

// export interface DoctorUser {
//   id: number
//   full_name: string
//   specialization: string
//   degree: string
//   avatar: string
//   role: 'doctor'
// }

export interface Appointment {
  id: number
  patient_name: string
  time: string
  date: string
  reason: string
  status: StatusType
  type: 'Khám trực tiếp' | 'Khám từ xa'
  avatar: string
}

// export interface Patient {
//   id: number
//   full_name: string
//   gender: 'male' | 'female'
//   age: number
//   blood_type: string
//   height: number
//   weight: number
//   last_visit: string
//   health_status: StatusType
//   condition: string
// }

export interface Alert {
  id: number
  patient_name: string
  message: string
  severity: 'low' | 'medium' | 'critical'
  time: string
  source: string
}

export interface ChatMessage {
  id: number
  user_name: string
  last_message: string
  time: string
  unread: number
  avatar: string
}

export interface DashboardStats {
  total_patients: number
  appointments_today: number
  pending_alerts: number
  messages_unread: number
}
// --------------------------------------------------------------------
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
