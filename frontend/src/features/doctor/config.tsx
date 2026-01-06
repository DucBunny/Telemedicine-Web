import {
  AlertTriangle,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { MOCK_STATS } from './data/mockData'

// Types
interface NavItem {
  id: string
  label: string
  mobileLabel?: string
  href: string
  icon: typeof LayoutDashboard
  group: 'main' | 'system'
}

// Data
export const NAVIGATION_ITEMS: Array<NavItem> = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    href: '/doctor/',
    icon: LayoutDashboard,
    group: 'main',
  },
  {
    id: 'appointments',
    label: 'Lịch hẹn',
    href: '/doctor/appointments',
    icon: Calendar,
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
    href: '/doctor/messages',
    icon: MessageSquare,
    group: 'main',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    href: '/doctor/settings',
    icon: Settings,
    group: 'system',
  },
]

export const DASHBOARD_STATS = [
  {
    label: 'Tổng bệnh nhân',
    value: MOCK_STATS.total_patients,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Lịch hẹn',
    value: MOCK_STATS.appointments_today,
    icon: Calendar,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    label: 'Cảnh báo',
    value: MOCK_STATS.pending_alerts,
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    label: 'Tin nhắn',
    value: MOCK_STATS.messages_unread,
    icon: MessageSquare,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
]
