import type { ApiPaginatedResponse, PaginationParams } from '@/types/api.type'
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
}
