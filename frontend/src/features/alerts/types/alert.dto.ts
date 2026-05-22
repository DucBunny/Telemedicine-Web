import type { AlertStatus } from '@/features/alerts/types'
import type { PaginationParams } from '@/types/api.type'

export interface GetMyAlertsParams extends PaginationParams {
  search?: string
  status?: AlertStatus
  handledBy?: number
  createdFrom?: string
  createdTo?: string
}

export interface ResolveAlertBody {
  symptoms: string
  diagnosis: string
  treatmentPlan?: string
  notes?: string
}

export interface PatientHealthHistoryItem {
  id: number
  type: string
  value: number
  status: AlertStatus
  createdAt: string
  resolvedAt?: string
}
