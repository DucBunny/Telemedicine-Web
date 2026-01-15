import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
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

  /**
   * Get all patients with pagination
   */
  // getAll: async (params: PaginationParams & { search?: string }) => {
  //   const { data } = await apiClient.get<ApiPaginatedResponse<Patient>>(
  //     PATIENT_BASE,
  //     { params },
  //   )
  //   return data
  // },

  // /**
  //  * Get patient by ID
  //  */
  // getById: async (id: number) => {
  //   const { data } = await apiClient.get<ApiSuccessResponse<Patient>>(
  //     `${PATIENT_BASE}/${id}`,
  //   )
  //   return data.data
  // },

  /**
   * Create new patient
  //  */
  // create: async (payload: Partial<Patient>) => {
  //   const { data } = await apiClient.post<ApiSuccessResponse<Patient>>(
  //     PATIENT_BASE,
  //     payload,
  //   )
  //   return data.data
  // },

  // /**
  //  * Update patient
  //  */
  // update: async (id: number, payload: Partial<Patient>) => {
  //   const { data } = await apiClient.put<ApiSuccessResponse<Patient>>(
  //     `${PATIENT_BASE}/${id}`,
  //     payload,
  //   )
  //   return data.data
  // },

  // /**
  //  * Delete patient
  //  */
  // delete: async (id: number) => {
  //   const { data } = await apiClient.delete<
  //     ApiSuccessResponse<{ message: string }>
  //   >(`${PATIENT_BASE}/${id}`)
  //   return data.data
  // },
}
