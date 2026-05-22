import type { Alert } from '@/features/alerts/types'
import type {
  GetMyAlertsParams,
  PatientHealthHistoryItem,
  ResolveAlertBody,
} from '@/features/alerts/types/alert.dto'
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'

import { apiClient } from '@/lib/axios'

const ALERT_BASE = '/alerts'

export const alertApi = {
  /**
   * Get all alerts for logged in user (offset-limit based) for doctor
   */
  getMyAlerts: async (params: GetMyAlertsParams) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Alert>>(
      `me/alerts`,
      { params },
    )
    return data
  },

  /**
   * Get health history for logged in user (offset-limit based) for patient
   */
  getMyHealthHistory: async (params: PaginationParams) => {
    const { data } = await apiClient.get<
      ApiPaginatedResponse<PatientHealthHistoryItem>
    >(`me/health-history`, { params })
    return data
  },

  /**
   * Mark an alert as read for logged in user (doctor)
   */
  markAsRead: async (alertId: number) => {
    const { data } = await apiClient.put<{ success: boolean }>(
      `${ALERT_BASE}/${alertId}/read`,
    )
    return data
  },

  /**
   * Claim handling an alert for logged in user (doctor)
   */
  claimHandling: async (alertId: number) => {
    const { data } = await apiClient.post<ApiSuccessResponse<Alert>>(
      `${ALERT_BASE}/${alertId}/handling`,
    )
    return data.data
  },

  /**
   * Release handling an alert
   */
  releaseHandling: async (alertId: number) => {
    const { data } = await apiClient.post<ApiSuccessResponse<Alert | null>>(
      `${ALERT_BASE}/${alertId}/release-handling`,
    )
    return data.data
  },

  /**
   * Resolve an alert and create a medical record
   */
  resolveAlert: async (alertId: number, payload: ResolveAlertBody) => {
    const { data } = await apiClient.post<
      ApiSuccessResponse<{
        alert: Alert
        medicalRecord: { id: number }
      }>
    >(`${ALERT_BASE}/${alertId}/resolve`, payload)

    return data.data
  },
}
