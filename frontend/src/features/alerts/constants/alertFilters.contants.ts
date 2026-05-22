import type { AlertStatus } from '@/features/alerts/types'

export const ALERT_FILTER_STATUS_OPTIONS: Array<{
  id: 'all' | AlertStatus
  label: string
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Đang chờ' },
  { id: 'handling', label: 'Đang xử lý' },
  { id: 'resolved', label: 'Đã xử lý' },
] as const
