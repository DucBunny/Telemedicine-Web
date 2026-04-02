import type { PaginationParams } from '@/types/api.type'
import type { PrescriptionItem } from '@/features/patient/types'

export interface GetMyRecordsParams extends PaginationParams {
  search?: string
}

export interface CreateRecordBody {
  appointmentId: number
  patientId: number
  doctorId: number
  symptoms?: string
  diagnosis: string
  treatmentPlan?: string
  prescription?: Array<PrescriptionItem>
  notes?: string
  followUpDate?: string
}

export interface UpdateRecordBody {
  symptoms?: string
  diagnosis?: string
  treatmentPlan?: string
  prescription?: Array<PrescriptionItem>
  notes?: string
  followUpDate?: string
}
