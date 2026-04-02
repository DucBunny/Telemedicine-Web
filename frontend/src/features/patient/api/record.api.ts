import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.type'
import type { MedicalRecord } from '@/features/patient/types'
import type {
  CreateRecordBody,
  GetMyRecordsParams,
  UpdateRecordBody,
} from '@/features/patient/dto/record.dto'
import { apiClient } from '@/lib/axios'

const RECORD_BASE = '/medical-records'

export const recordApi = {
  /**
   * Get the logged-in patient's own medical records
   */
  getMyRecords: async (params?: GetMyRecordsParams) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<MedicalRecord>>(
      `me/medical-records`,
      { params },
    )

    return data
  },

  /**
   * Get a medical record by ID
   */
  getRecordById: async (id: number) => {
    const { data } = await apiClient.get<ApiSuccessResponse<MedicalRecord>>(
      `${RECORD_BASE}/${id}`,
    )

    return data.data
  },

  /**
   * Create a new medical record (doctor only)
   */
  createRecord: async (payload: CreateRecordBody) => {
    const { data } = await apiClient.post<ApiSuccessResponse<MedicalRecord>>(
      RECORD_BASE,
      payload,
    )

    return data.data
  },

  /**
   * Update a medical record (doctor only)
   */
  updateRecord: async (id: number, payload: UpdateRecordBody) => {
    const { data } = await apiClient.put<ApiSuccessResponse<MedicalRecord>>(
      `${RECORD_BASE}/${id}`,
      payload,
    )

    return data.data
  },

  /**
   * Delete a medical record (admin only)
   */
  deleteRecord: async (id: number) => {
    const { data } = await apiClient.delete<
      ApiSuccessResponse<{ message: string }>
    >(`${RECORD_BASE}/${id}`)

    return data.data
  },
}
