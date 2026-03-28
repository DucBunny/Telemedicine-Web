import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.type'
import type { Appointment } from '@/features/patient/types'
import type {
  CancelAppointmentBody,
  CreateAppointmentBody,
  GetAvailableSlotsParams,
  GetMyAppointmentsParams,
} from '@/features/patient/dto/appointment.dto'
import { apiClient } from '@/lib/axios'

const APPOINTMENT_BASE = '/appointments'

export const appointmentApi = {
  /**
   * Get patient's appointments with pagination and optional status filter
   */
  getMyAppointments: async (params: GetMyAppointmentsParams) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Appointment>>(
      `me/appointments`,
      { params },
    )

    return data
  },

  /**
   * Get available slots for a doctor on a specific date
   */
  getAvailableSlots: async (params: GetAvailableSlotsParams) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Array<string>>>(
      `${APPOINTMENT_BASE}/available-slots`,
      { params },
    )

    return data.data
  },

  /**
   * Create an appointment
   */
  createAppointment: async (payload: CreateAppointmentBody) => {
    const { data } = await apiClient.post<ApiSuccessResponse<Appointment>>(
      `${APPOINTMENT_BASE}`,
      payload,
    )

    return data
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (id: number, payload: CancelAppointmentBody) => {
    const { data } = await apiClient.put<ApiSuccessResponse<Appointment>>(
      `${APPOINTMENT_BASE}/${id}/cancel`,
      payload,
    )

    return data
  },
}
