import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import type { MedicalRecord } from '../types'
import { apiClient } from '@/lib/axios'

const RECORD_BASE = '/records'

export const recordApi = {
  /**
   * Get patient's records
   */
  getPatientRecords: async (
    params: PaginationParams & { status?: Array<string> },
  ) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<MedicalRecord>>(
      `${RECORD_BASE}/patient`,
      { params },
    )

    return data
  },
}
