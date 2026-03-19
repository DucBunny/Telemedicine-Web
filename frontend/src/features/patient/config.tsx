import {
  Bell,
  CalendarDays,
  FileText,
  Home,
  MessageSquare,
  User,
} from 'lucide-react'

// Types
export interface NavItem {
  id: string
  label: string
  mobileLabel?: string
  href: string
  icon: typeof Home
}

// Data
export const NAVIGATION_ITEMS: Array<NavItem> = [
  {
    id: 'home',
    label: 'Tổng quan',
    mobileLabel: 'Trang chủ',
    href: '/patient/',
    icon: Home,
  },
  {
    id: 'appointments',
    label: 'Lịch hẹn khám',
    mobileLabel: 'Lịch hẹn',
    href: '/patient/appointments',
    icon: CalendarDays,
  },
  {
    id: 'records',
    label: 'Hồ sơ bệnh án',
    mobileLabel: 'Hồ sơ',
    href: '/patient/records',
    icon: FileText,
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    href: '/patient/notifications',
    icon: Bell,
  },
  {
    id: 'chat',
    label: 'Chat với bác sĩ',
    mobileLabel: 'Chat',
    href: '/patient/chat',
    icon: MessageSquare,
  },
  {
    id: 'profile',
    label: 'Thông tin cá nhân',
    mobileLabel: 'Cá nhân',
    href: '/patient/profile',
    icon: User,
  },
]

export const STATUS_FILTER_OPTIONS = [
  {
    value: 'confirmed',
    label: 'Đã xác nhận',
    color: 'text-green-700 bg-green-100',
    variant: 'teal_outline',
  },
  {
    value: 'pending',
    label: 'Chờ duyệt',
    color: 'text-yellow-700 bg-yellow-100',
    variant: 'orange_outline',
  },
  {
    value: 'upcoming',
    label: 'Sắp tới',
    color: 'text-green-700 bg-green-100',
  },
  {
    value: 'completed',
    label: 'Đã hoàn thành',
    color: 'text-blue-700 bg-blue-100',
    variant: 'purple_outline',
  },
  {
    value: 'cancelled',
    label: 'Đã hủy',
    color: 'text-red-700 bg-red-100',
    variant: 'red_outline',
  },
]
