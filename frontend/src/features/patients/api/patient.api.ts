import type { Patient } from '@/features/patients/types'
import type { GetMyPatientsParams } from '@/features/patients/types/patient.dto'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.type'

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

  /**
   * Get patient detail by id
   */
  getPatientDetail: async (patientId: number) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Patient>>(
      `${PATIENT_BASE}/${patientId}`,
    )

    return data.data
  },
}
