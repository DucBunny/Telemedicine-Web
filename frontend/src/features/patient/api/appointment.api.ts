import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import type { Appointment } from '../types'
import { apiClient } from '@/lib/axios'

const APPOINTMENT_BASE = '/appointments'

export const appointmentApi = {
  /**
   * Get patient's appointments
   */
  getPatientAppointments: async (
    params: PaginationParams & { status?: Array<string> },
  ) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Appointment>>(
      `${APPOINTMENT_BASE}/patient`,
      { params },
    )

    return data
  },

  /**
   * Get available slots for a doctor on a specific date
   */
  getAvailableSlots: async (doctorId: number, date: string) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Array<string>>>(
      `${APPOINTMENT_BASE}/available-slots`,
      { params: { doctor_id: doctorId, date } },
    )

    return data
  },

  /**
   * Book an appointment
   */
  bookAppointment: async (payload: {
    doctor_id: number
    scheduled_at: string
    reason: string
    duration?: number
  }) => {
    const { data } = await apiClient.post<ApiSuccessResponse<Appointment>>(
      `${APPOINTMENT_BASE}/book`,
      payload,
    )

    return data
  },
}
