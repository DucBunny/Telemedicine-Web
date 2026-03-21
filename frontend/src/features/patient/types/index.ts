import type { User } from '@/features/admin/api/user.api'

// Types
export type GenderOption = 'male' | 'female' | 'other'
export type BloodTypeOption =
  | 'A+'
  | 'B+'
  | 'AB+'
  | 'O+'
  | 'A-'
  | 'B-'
  | 'AB-'
  | 'O-'
  | 'unknown'
export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'upcoming'
  | 'completed'
  | 'cancelled'

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

// Entity Interfaces --------------------------------------------------
// Chuyên khoa
export interface Specialty {
  id: number
  name: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

// Bác sĩ
export interface Doctor {
  userId: number
  specialtyId: number
  degree: string
  experienceYears: number
  bio: string
  address: string
  createdAt: string
  updatedAt: string
  user: User
  specialty: Specialty
}

// Bệnh nhân
export interface Patient {
  userId: number
  dateOfBirth: string
  gender: GenderOption
  bloodType: BloodTypeOption
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

// Lịch hẹn khám bệnh
export interface Appointment {
  id: number
  patientId: number
  doctorId: number
  scheduledAt: string
  actualEndedAt: string | null
  durationMinutes: number
  status: string
  type: 'offline' | 'online'
  meetingLink: string
  reason: string
  cancelReason: string | null
  createdAt: string
  updatedAt: string
  doctor?: Doctor
  patient?: Patient
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
