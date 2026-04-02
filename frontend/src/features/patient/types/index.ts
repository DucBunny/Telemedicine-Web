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
export type AppointmentType = 'offline' | 'online'

export type NotificationType = 'alert' | 'appointment' | 'message'

// Chat Types
export interface ChatUser {
  id: number
  fullName: string
  avatar?: string
  email?: string
}

export interface ChatMessage {
  id: number
  senderId: number
  receiverId: number
  message: string
  attachmentUrl?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  sender?: ChatUser
  receiver?: ChatUser
}

export interface ChatConversation {
  user: ChatUser
  lastMessage: {
    message: string
    createdAt: string
    isRead: boolean
  } | null
  unreadCount: number
}

// --------------------------------------------------------------------
export interface Device {
  id?: number
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
  appointmentId: number
  symptoms: string
  diagnosis: string
  treatmentPlan?: string
  prescription?: Array<PrescriptionItem>
  notes?: string
  followUpDate?: string
  createdAt: string
  updatedAt: string
  doctor?: Doctor
  patient?: Patient
  appointment?: Appointment
  medicalAttachments?: Array<MedicalAttachment>
}

export interface MedicalAttachment {
  id: number
  medicalRecordId: number
  fileName: string
  fileUrl: string
  fileType: 'image' | 'pdf'
  uploadedAt: string
}

export interface PrescriptionItem {
  name: string
  dosage: string
  duration: string
}

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  content: string
  referenceId?: number
  senderId?: number
  isRead: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
  sender?: User
}
