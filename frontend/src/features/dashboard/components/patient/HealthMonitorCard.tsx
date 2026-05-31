import { Link } from '@tanstack/react-router'
import { Bell } from 'lucide-react'

import { HealthHistoryTimeline } from '@/features/alerts/components/patient'
import { useGetMyHealthHistory } from '@/features/alerts/hooks/useAlertQueries'
import { cn } from '@/lib/utils'

interface HealthMonitorCardProps {
  className?: string
}

export const HealthMonitorCard = ({ className }: HealthMonitorCardProps) => {
  const { data, isLoading, isError } = useGetMyHealthHistory({
    page: 1,
    limit: 5,
  })

  const items = data?.data ?? []

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="size-4 shrink-0 fill-red-600 text-red-600" />
            <h3 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
              Cảnh báo
            </h3>
          </div>
          <Link
            to="/patient/health-history"
            className="text-xs font-medium text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {isLoading ? (
            <p className="flex flex-1 items-center justify-center text-sm text-slate-500">
              Đang tải...
            </p>
          ) : isError ? (
            <p className="flex flex-1 items-center justify-center text-sm text-red-500">
              Không thể tải lịch sử
            </p>
          ) : items.length === 0 ? (
            <p className="flex flex-1 items-center justify-center text-sm text-slate-500">
              Chưa có sự kiện sức khỏe nào.
            </p>
          ) : (
            <HealthHistoryTimeline
              items={items}
              className="flex-1 justify-between"
            />
          )}
        </div>
      </div>
    </div>
  )
}
