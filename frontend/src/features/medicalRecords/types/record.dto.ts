import type { PrescriptionItem } from '@/features/medicalRecords/types'
import type { PaginationParams } from '@/types/api.type'

export interface GetMyRecordsParams extends PaginationParams {
  search?: string
}

export interface GetPatientMedicalRecordsParams extends PaginationParams {
  search?: string
  createdFrom?: string
  createdTo?: string
}

export interface CreateRecordBody {
  appointmentId: number
  patientId: number
  doctorId: number
  symptoms: string
  diagnosis: string
  treatmentPlan?: string
  prescription?: Array<PrescriptionItem>
  notes?: string
}

export interface UpdateRecordBody {
  symptoms?: string
  diagnosis?: string
  treatmentPlan?: string
  prescription?: Array<PrescriptionItem>
  notes?: string
}
