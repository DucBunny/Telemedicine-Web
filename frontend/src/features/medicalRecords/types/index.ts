import type { Alert } from '@/features/alerts/types'
import type { Appointment } from '@/features/appointments/types'
import type { Doctor } from '@/features/doctors/types'
import type { Patient } from '@/features/patients/types'

export type EcgAbnormalStripType = 'trigger' | 'last_detected'
export type EcgAbnormalStripDetectedClass = 'S' | 'V' | 'F' | 'Q'

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
  ecgAbnormalStrips?: Array<EcgAbnormalStrip>
}

export interface MedicalAttachment {
  id: number
  medicalRecordId?: number
  alertId?: number
  fileName: string
  fileUrl: string
  fileType: string
  category?: 'auto_ecg_report' | 'other'
  uploadedAt: string
}

export interface EcgAbnormalStrip {
  id: string | null
  stripType: EcgAbnormalStripType
  referenceTimestamp: string
  windowStart: string
  windowEnd: string
  durationSeconds: number
  ecgData: Array<number>
  detectedClasses: Array<EcgAbnormalStripDetectedClass>
}

export interface ExportMedicalReportResponse {
  status: 'ready' | 'queued'
  cached: boolean
  fileUrl?: string
  fileName?: string
  message: string
}

export interface PrescriptionItem {
  name: string
  dosage: string
  duration: string
}
