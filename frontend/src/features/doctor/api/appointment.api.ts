import type { ApiPaginatedResponse, PaginationParams } from '@/types/api.type'
import type { Appointment } from '../types'
import { apiClient } from '@/lib/axios'

const APPOINTMENT_BASE = '/appointments'

export const appointmentApi = {
  /**
   * Get doctor's appointments
   */
  getDoctorAppointments: async (
    params: PaginationParams & { status?: string },
  ) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Appointment>>(
      `${APPOINTMENT_BASE}/doctor`,
      { params },
    )

    return data
  },
}
