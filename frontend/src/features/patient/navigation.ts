import {
  Bell,
  CalendarDays,
  FileText,
  Home,
  MessageSquare,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  mobileLabel?: string
  href: string
  icon: LucideIcon
}

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
