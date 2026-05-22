import { useState } from 'react'
import { Clock, Ellipsis } from 'lucide-react'

import type { Notification } from '@/features/notifications/types'

import { NotificationDetailDialog } from '@/features/notifications/components/common'
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
  useMarkNotificationAsUnread,
} from '@/features/notifications/hooks/useNotificationQueries'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  formatDistanceToNowWithSeconds,
  formatShortDate,
  formatTime,
} from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { NOTIFICATION_TYPE_FILTERS } from '@/types/constants'

interface NotificationItemProps {
  notification: Notification
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { mutate: markAsRead } = useMarkNotificationAsRead()
  const { mutate: markAsUnread } = useMarkNotificationAsUnread()
  const { mutate: deleteNotification } = useDeleteNotification()

  const handleOpenDialog = () => {
    setSelectedNotification(notification)
    setIsDetailDialogOpen(true)

    if (!notification.isRead) markAsRead(notification.id)
  }

  return (
    <>
      <div
        onDoubleClick={handleOpenDialog}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md',
          !notification.isRead
            ? 'border-teal-primary bg-teal-50/50'
            : 'border-gray-200',
        )}>
        {!notification.isRead && (
          <div className="bg-teal-primary absolute top-0 left-0 h-full w-1" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-1 rounded-full focus-visible:ring-0">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => markAsRead(notification.id)}
              hidden={notification.isRead}>
              Đánh dấu là đã đọc
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => markAsUnread(notification.id)}
              hidden={!notification.isRead}>
              Đánh dấu là chưa đọc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              Xóa thông báo này
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center justify-between gap-2 pr-5">
          <Badge
            variant={
              NOTIFICATION_TYPE_FILTERS[notification.type].variant || 'default'
            }
            className="rounded-full text-xs">
            {NOTIFICATION_TYPE_FILTERS[notification.type].label}
          </Badge>

          <span className="flex items-center gap-1 text-xs text-slate-500 md:text-sm">
            <Clock className="size-4" />
            {formatDistanceToNowWithSeconds(notification.createdAt)}
          </span>
        </div>

        <h3 className="mt-2 mb-1 text-sm font-bold text-slate-900 md:text-base">
          {notification.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 md:text-sm">
          {notification.content}
        </p>
      </div>

      <NotificationDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        notification={selectedNotification}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => deleteNotification(notification.id)}
        title="Xóa thông báo"
        description={
          <>
            Bạn có chắc chắn muốn xóa thông báo{' '}
            <span className="text-teal-primary font-semibold">
              {notification.title}
            </span>{' '}
            nhận được vào lúc{' '}
            <span className="text-teal-primary font-semibold">
              {formatTime(notification.createdAt)}
            </span>{' '}
            ngày{' '}
            <span className="text-teal-primary font-semibold">
              {formatShortDate(notification.createdAt)}
            </span>{' '}
            không?
          </>
        }
        confirmLabel="Xóa"
      />
    </>
  )
}
