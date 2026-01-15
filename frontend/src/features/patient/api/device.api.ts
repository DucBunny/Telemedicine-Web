import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import type { Device } from '../types'
import { apiClient } from '@/lib/axios'

const PATIENT_BASE = '/patients'

export const deviceApi = {
  /**
   * Get patient's devices
   */
  getPatientDevices: async (id: number) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Array<Device>>>(
      `${PATIENT_BASE}/${id}/devices`,
    )
    return data.data
  },

  /**
   * Get my devices (for logged in patient)
   */
  getMyDevices: async () => {
    const { data } = await apiClient.get<ApiSuccessResponse<Array<Device>>>(
      `${PATIENT_BASE}/me/devices`,
    )
    return data.data
  },
}
