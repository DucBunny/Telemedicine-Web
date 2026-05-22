import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  CalendarCheck2,
  CalendarClock,
  MessageSquare,
} from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'

import type { LucideIcon } from 'lucide-react'
import type { DoctorStats } from '@/features/dashboard/types'

import { getVietnamTodayUtcRange } from '@/lib/format-date'
import { cn } from '@/lib/utils'

type AppointmentsSearch = {
  status?: 'confirmed' | 'pending'
  scheduledFrom?: string
  scheduledTo?: string
}

interface StatInfo {
  label: string
  mobileLabel?: string
  value: string | number
  icon: LucideIcon
  color: string
  bg: string
  navigateTo: '/doctor/appointments' | '/doctor/alerts' | '/doctor/chat'
  search?: AppointmentsSearch
}

interface StatCardsProps {
  stats: DoctorStats | undefined
}

const StatCard = ({ stat }: { stat: StatInfo }) => {
  const isMobileLabel = useMediaQuery(
    '(max-width: 767px) or (1024px <= width < 1280px)',
  )

  return (
    <Link
      to={stat.navigateTo}
      search={stat.search}
      className="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 md:justify-between md:p-4 lg:py-7 xl:p-5">
      <div className="order-last md:order-first">
        <p className="mb-0.5 text-xs font-medium text-gray-500 md:text-sm">
          {isMobileLabel ? stat.mobileLabel : stat.label}
        </p>
        <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
          {stat.value}
        </h3>
      </div>

      <div
        className={cn(
          'order-first rounded-lg p-2 md:order-last md:p-3',
          stat.bg,
        )}>
        <stat.icon
          className={cn('size-5 md:size-6', stat.color)}
          strokeWidth="2.5"
        />
      </div>
    </Link>
  )
}

export const StatCards = ({ stats }: StatCardsProps) => {
  const { scheduledFrom, scheduledTo } = getVietnamTodayUtcRange()

  const DOCTOR_DASHBOARD_STATS: Array<StatInfo> = [
    {
      label: 'Lịch hẹn hôm nay',
      mobileLabel: 'Lịch hôm nay',
      value: stats ? stats.totalAppointmentsConfirmedToday : 'N/A',
      icon: CalendarCheck2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      navigateTo: '/doctor/appointments',
      search: {
        status: 'confirmed',
        scheduledFrom,
        scheduledTo,
      },
    },
    {
      label: 'Lịch hẹn chờ duyệt',
      mobileLabel: 'Lịch chờ duyệt',
      value: stats ? stats.totalAppointmentsPending : 'N/A',
      icon: CalendarClock,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
      navigateTo: '/doctor/appointments',
      search: { status: 'pending' },
    },
    {
      label: 'Cảnh báo chưa xử lý',
      mobileLabel: 'Cảnh báo',
      value: stats ? stats.totalAlertsPending : 'N/A',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      navigateTo: '/doctor/alerts',
      search: { status: 'pending' },
    },
    {
      label: 'Tin nhắn chưa đọc',
      mobileLabel: 'Tin nhắn',
      value: stats ? stats.totalUnreadConversations : 'N/A',
      icon: MessageSquare,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      navigateTo: '/doctor/chat',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {DOCTOR_DASHBOARD_STATS.map((stat, idx) => (
        <StatCard key={idx} stat={stat} />
      ))}
    </div>
  )
}
