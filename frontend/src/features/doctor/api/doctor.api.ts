import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import type { Doctor } from '../types'
import { apiClient } from '@/lib/axios'

const DOCTOR_BASE = '/doctors'

export const doctorApi = {
  /**
   * Get current doctor profile
   */
  getProfile: async () => {
    const { data } = await apiClient.get<ApiSuccessResponse<Doctor>>(
      `${DOCTOR_BASE}/profile`,
    )
    return data.data
  },
}
