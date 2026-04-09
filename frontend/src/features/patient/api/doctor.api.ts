import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import type { Doctor } from '@/features/patient/types'
import { apiClient } from '@/lib/axios'

const DOCTOR_BASE = '/doctors'

export const doctorApi = {
  /**
   * Get all doctors (for patient to browse and book)
   */
  getAllDoctors: async (
    params: PaginationParams & {
      search?: string
      specialtyId?: number | null
    },
  ) => {
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
