import type {
  BloodTypeOption,
  GenderOption,
  NotificationType,
} from '@/features/patient/types'

export const APPOINTMENT_STATUS_FILTERS: Record<
  string,
  { label: string; color: string; variant?: string }
> = {
  confirmed: {
    label: 'Đã xác nhận',
    color: 'text-green-700 bg-green-100',
    variant: 'teal_outline',
  },
  pending: {
    label: 'Chờ duyệt',
    color: 'text-yellow-700 bg-yellow-100',
    variant: 'orange_outline',
  },
  upcoming: {
    label: 'Sắp tới',
    color: 'text-green-700 bg-green-100',
  },
  completed: {
    label: 'Đã hoàn thành',
    color: 'text-blue-700 bg-blue-100',
    variant: 'purple_outline',
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'text-red-700 bg-red-100',
    variant: 'red_outline',
  },
} as const

export const BLOOD_TYPE_OPTIONS: Array<{
  value: BloodTypeOption
  label: string
}> = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'unknown', label: 'Không rõ' },
] as const

export const GENDER_OPTIONS: Array<{
  value: GenderOption
  label: string
}> = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const

export const NOTIFICATION_TYPE_FILTERS: Record<
  NotificationType,
  { label: string; variant?: string }
> = {
  alert: {
    label: 'Cảnh báo',
    variant: 'red_blur',
  },
  appointment: {
    label: 'Lịch hẹn',
    variant: 'blue_blur',
  },
  message: {
    label: 'Tin nhắn',
    variant: 'teal_blur',
  },
} as const
