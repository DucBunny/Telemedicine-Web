import { Clock } from 'lucide-react'
import type {
  NotificationCategory,
  NotificationItemData,
} from '../../data/notificationsMockData'
import { Badge } from '@/components/ui/badge'

interface NotificationItemProps {
  data: NotificationItemData
  onClick: (id: string) => void
}

export const NotificationItem = ({ data, onClick }: NotificationItemProps) => {
  const getCategoryStyles = (category: NotificationCategory) => {
    switch (category) {
      case 'Lịch hẹn':
        return 'blue_blur'
      case 'Cảnh báo':
        return 'red_blur'
      case 'Tin nhắn':
        return 'teal_blur'
      case 'Hệ thống':
        return 'purple_blur'
    }
  }

  return (
    <div
      onClick={() => onClick(data.id)}
      className="relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {data.isUnread && (
        <div className="bg-teal-primary absolute top-0 left-0 h-full w-1"></div>
      )}

      <div className="flex items-center justify-between gap-2">
        <Badge
          variant={getCategoryStyles(data.category) as any}
          className="rounded-full text-xs">
          {data.category}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="size-4" />
          {data.time}
        </span>
      </div>

      <h3 className="mt-2 mb-1 text-sm font-bold text-slate-900">
        {data.title}
      </h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
        {data.content}
      </p>
    </div>
  )
}
