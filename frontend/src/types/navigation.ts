import {
  Bell,
  CalendarDays,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
  Users,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  mobileLabel?: string
  href: string
  icon: LucideIcon
  group?: 'main' | 'system'
}

export const PATIENT_NAVIGATION_ITEMS: Array<NavItem> = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    mobileLabel: 'Trang chủ',
    href: '/patient',
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

export const DOCTOR_NAVIGATION_ITEMS: Array<NavItem> = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    mobileLabel: 'Trang chủ',
    href: '/doctor',
    icon: LayoutDashboard,
    group: 'main',
  },
  {
    id: 'appointments',
    label: 'Lịch hẹn khám',
    mobileLabel: 'Lịch hẹn',
    href: '/doctor/appointments',
    icon: CalendarDays,
    group: 'main',
  },
  {
    id: 'patients',
    label: 'Quản lý bệnh nhân',
    mobileLabel: 'Bệnh nhân',
    href: '/doctor/patients',
    icon: Users,
    group: 'main',
  },
  {
    id: 'chat',
    label: 'Tư vấn trực tuyến',
    mobileLabel: 'Chat',
    href: '/doctor/chat',
    icon: MessageSquare,
    group: 'main',
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    href: '/doctor/notifications',
    icon: Bell,
    group: 'system',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    mobileLabel: 'Cài đặt',
    href: '/doctor/settings',
    icon: Settings,
    group: 'system',
  },
]
