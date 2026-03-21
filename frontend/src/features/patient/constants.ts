import type { BloodTypeOption } from '@/features/patient/types'

export const STATUS_FILTER_OPTIONS: Record<
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

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const
