import type { AppointmentType } from '@/features/patient/types'
import type { PaginationParams } from '@/types/api.type'

export interface GetMyAppointmentsParams extends PaginationParams {
  status?: Array<string>
}

export interface GetAvailableSlotsParams {
  doctorId: number
  date: string
}

export interface CreateAppointmentBody {
  doctorId: number
  scheduledAt: string
  durationMinutes?: 30 | 60
  type: AppointmentType
  reason: string
}

export interface CancelAppointmentBody {
  cancelReason: string
}
