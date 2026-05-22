import type { Alert } from '@/features/alerts/types'
import type { Appointment } from '@/features/appointments/types'
import type { Doctor } from '@/features/doctors/types'
import type { Patient } from '@/features/patients/types'

export interface MedicalRecord {
  id: number
  patientId: number
  doctorId: number
  appointmentId?: number
  alertId?: number
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
  alert?: Alert
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
