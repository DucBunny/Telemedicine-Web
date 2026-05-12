import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'
import type { PaginationParams } from '@/types/api.type'

export interface GetMyAppointmentsParams extends PaginationParams {
  search?: string
  status?: Array<AppointmentStatus>
  type?: AppointmentType
  scheduledFrom?: string
  scheduledTo?: string
}

export type GetPatientAppointmentsParams = GetMyAppointmentsParams

export interface GetAvailableSlotsParams {
  doctorId: number
  date: string
}

export interface CreateAppointmentBody {
  doctorId?: number
  patientId?: number
  scheduledAt: string
  durationMinutes?: 30 | 60
  type: AppointmentType
  reason: string
}

export interface PatchAppointmentStatusBody {
  status: 'completed' | 'cancelled'
  cancelReason?: string
}

export interface CancelAppointmentBody {
  cancelReason: string
}
