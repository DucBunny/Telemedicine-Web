import type { Doctor } from '@/features/doctors/types'
import type { Patient } from '@/features/patients/types'
import type {
  ChangePasswordBody,
  UpdateDoctorProfileBody,
  UpdatePatientProfileBody,
} from '@/features/profile/types/profile.dto'
import type { ApiSuccessResponse } from '@/types/api.type'

import { apiClient } from '@/lib/axios'

export const profileApi = {
  /**
   * Get current user profile
   */
  getProfile: async <T>() => {
    const { data } = await apiClient.get<ApiSuccessResponse<T>>('me/profile')

    return data.data
  },

  /**
   * Update current patient profile
   */
  updatePatientProfile: async (payload: UpdatePatientProfileBody) => {
    const { data } = await apiClient.put<ApiSuccessResponse<Patient>>(
      'me/profile',
      payload,
    )

    return data.data
  },

  /**
   * Update current doctor profile
   */
  updateDoctorProfile: async (payload: UpdateDoctorProfileBody) => {
    const { data } = await apiClient.put<ApiSuccessResponse<Doctor>>(
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
