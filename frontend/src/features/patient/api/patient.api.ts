import type { ApiSuccessResponse } from '@/types/api.type'
import type { Patient } from '@/features/patient/types'
import type {
  ChangePasswordBody,
  UpdatePatientProfileBody,
} from '@/features/patient/dto/patient.dto'
import { apiClient } from '@/lib/axios'

export const patientApi = {
  /**
   * Get current patient profile
   */
  getProfile: async () => {
    const { data } =
      await apiClient.get<ApiSuccessResponse<Patient>>('me/profile')

    return data.data
  },

  /**
   * Update current patient profile
   */
  updateProfile: async (payload: UpdatePatientProfileBody) => {
    const { data } = await apiClient.put<ApiSuccessResponse<Patient>>(
      'me/profile',
      payload,
    )

    return data.data
  },

  /**
   * Change password
   */
  changePassword: async (payload: ChangePasswordBody) => {
    const { data } = await apiClient.put<
      ApiSuccessResponse<{ success: boolean }>
    >('me/change-password', payload)

    return data.success
  },
}
