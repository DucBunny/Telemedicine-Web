import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import type { Patient } from '../types'
import { apiClient } from '@/lib/axios'

const PATIENT_BASE = '/patients'

export const patientApi = {
  /**
   * Get all patients with pagination
   */
  getAll: async (params: PaginationParams & { search?: string }) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Patient>>(
      `${PATIENT_BASE}/doctor`,
      { params },
    )

    return data
  },
}
