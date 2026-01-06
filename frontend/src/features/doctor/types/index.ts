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

export interface DoctorUser {
  id: number
  full_name: string
  specialization: string
  degree: string
  avatar: string
  role: 'doctor'
}

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

export interface Patient {
  id: number
  full_name: string
  gender: 'male' | 'female'
  age: number
  blood_type: string
  height: number
  weight: number
  last_visit: string
  health_status: StatusType
  condition: string
}

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
