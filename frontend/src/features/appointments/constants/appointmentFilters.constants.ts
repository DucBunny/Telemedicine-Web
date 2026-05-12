import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'

export const APPOINTMENT_FILTER_STATUS_OPTIONS: Array<{
  id: 'all' | AppointmentStatus
  label: string
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ duyệt' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
]

export const APPOINTMENT_FILTER_TYPE_OPTIONS: Array<{
  id: 'all' | AppointmentType
  label: string
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'offline', label: 'Trực tiếp' },
  { id: 'online', label: 'Online' },
]
