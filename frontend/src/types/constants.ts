import type { BadgeVariant } from '@/components/ui/badge'
import type { AlertStatus } from '@/features/alerts/types'
import type { AppointmentStatus, TimeSlot } from '@/features/appointments/types'
import type { NotificationType } from '@/features/notifications/types'
import type { BloodTypeOption, GenderOption } from '@/features/patients/types'

export const APPOINTMENT_STATUS_FILTERS: Record<
  AppointmentStatus | 'upcoming',
  { label: string; color: string; variant?: BadgeVariant }
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

export const ALERT_STATUS_FILTERS: Record<
  AlertStatus,
  { label: string; variant?: BadgeVariant }
> = {
  pending: {
    label: 'Đang chờ',
    variant: 'red_blur',
  },
  handling: {
    label: 'Đang xử lý',
    variant: 'blue_blur',
  },
  resolved: {
    label: 'Đã xử lý',
    variant: 'green_blur',
  },
} as const

export const NOTIFICATION_TYPE_FILTERS: Record<
  NotificationType,
  { label: string; variant?: BadgeVariant }
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
  system: {
    label: 'Hệ thống',
    variant: 'orange_blur',
  },
} as const

export const BASE_MORNING_SLOTS: Array<TimeSlot> = [
  { time: '08:00', isAvailable: false },
  { time: '08:30', isAvailable: false },
  { time: '09:00', isAvailable: false },
  { time: '09:30', isAvailable: false },
  { time: '10:00', isAvailable: false },
  { time: '10:30', isAvailable: false },
  { time: '11:00', isAvailable: false },
  { time: '11:30', isAvailable: false },
]

export const BASE_AFTERNOON_SLOTS: Array<TimeSlot> = [
  { time: '13:30', isAvailable: false },
  { time: '14:00', isAvailable: false },
  { time: '14:30', isAvailable: false },
  { time: '15:00', isAvailable: false },
  { time: '15:30', isAvailable: false },
  { time: '16:00', isAvailable: false },
  { time: '16:30', isAvailable: false },
]
