import type { Patient } from '@/features/patients/types'
import type { GetMyPatientsParams } from '@/features/patients/types/patient.dto'
import type { ApiPaginatedResponse } from '@/types/api.type'

import { apiClient } from '@/lib/axios'

const PATIENT_BASE = '/patients'

export const patientApi = {
  /**
   * Get all patients for logged in user (offset-limit based)
   */
  getMyPatients: async (params: GetMyPatientsParams) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Patient>>(
      `me/patients`,
      { params },
    )

    return data
  },
}
