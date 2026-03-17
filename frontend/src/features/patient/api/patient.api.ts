import type { ApiSuccessResponse } from '@/types/api.type'
import type { Patient } from '../types'
import { apiClient } from '@/lib/axios'

const PATIENT_BASE = '/patients'

export const patientApi = {
  /**
   * Get current patient profile
   */
  getProfile: async () => {
    const { data } = await apiClient.get<ApiSuccessResponse<Patient>>(
      `${PATIENT_BASE}/profile`,
    )

    return data.data
  },
}
