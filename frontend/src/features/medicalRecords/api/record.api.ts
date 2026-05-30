import type {
  ExportMedicalReportResponse,
  MedicalRecord,
} from '@/features/medicalRecords/types'
import type {
  CreateRecordBody,
  GetMyRecordsParams,
  GetPatientMedicalRecordsParams,
  UpdateRecordBody,
} from '@/features/medicalRecords/types/record.dto'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api.type'

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
   * Get medical records by patient ID and current doctor ID
   */
  getRecordsByPatientIdAndCurrentDoctor: async (
    patientId: number,
    params: GetPatientMedicalRecordsParams,
  ) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<MedicalRecord>>(
      `me/patients/${patientId}/medical-records`,
      { params },
    )

    return data
  },

  /**
   * Request an ECG report export for a medical record or alert.
   */
  exportReport: async (payload: {
    medicalRecordId?: number
    alertId?: number
  }) => {
    const { data } = await apiClient.post<
      ApiSuccessResponse<ExportMedicalReportResponse>
    >(`${RECORD_BASE}/reports/export`, payload)

    return data.data
  },
}
