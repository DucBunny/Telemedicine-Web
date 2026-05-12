import type { Doctor } from '@/features/doctors/types'
import type { GetAllDoctorsParams } from '@/features/doctors/types/doctor.dto'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.type'

import { apiClient } from '@/lib/axios'

const DOCTOR_BASE = '/doctors'

export const doctorApi = {
  /**
   * Get all doctors (for patient to browse and book) (offset-limit based)
   */
  getAllDoctors: async (params: GetAllDoctorsParams) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Doctor>>(
      DOCTOR_BASE,
      { params },
    )

    return data
  },

  /**
   * Get doctor detail by id
   */
  getDoctorDetail: async (doctorId: number) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Doctor>>(
      `${DOCTOR_BASE}/${doctorId}`,
    )

    return data.data
  },
}
