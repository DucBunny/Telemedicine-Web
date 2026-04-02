import type { Specialty } from '@/features/patient/types'
import type { ApiSuccessResponse } from '@/types/api.type'
import { apiClient } from '@/lib/axios'

const SPECIALTY_BASE = '/specialties'

export const specialtyApi = {
  /**
   * Get all specialties (for patient to browse and book)
   */
  getAllSpecialties: async () => {
    const { data } =
      await apiClient.get<ApiSuccessResponse<Array<Specialty>>>(SPECIALTY_BASE)

    return data.data
  },

  /**
   * Get specialty detail by id (for patient to book)
   */
  getSpecialtyDetail: async (id: number) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Specialty>>(
      `${SPECIALTY_BASE}/${id}`,
    )

    return data.data
  },
}
