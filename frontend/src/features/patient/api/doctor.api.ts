import type { ApiPaginatedResponse } from '@/types/api.type'
import type { Doctor } from '../types'
import { apiClient } from '@/lib/axios'

const DOCTOR_BASE = '/doctors'

export const doctorApi = {
  /**
   * Get all doctors (for patient to browse and book)
   */
  getAllDoctors: async (params?: {
    page?: number
    limit?: number
    search?: string
    specialty_id?: number | null
  }) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Doctor>>(
      DOCTOR_BASE,
      { params },
    )
    return data
  },
}
