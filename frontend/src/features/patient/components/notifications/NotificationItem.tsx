import { Clock, Ellipsis } from 'lucide-react'
import { useState } from 'react'
import type { Notification } from '@/features/patient/types'
import { Badge } from '@/components/ui/badge'
import { NOTIFICATION_TYPE_FILTERS } from '@/features/patient/constants'
import {
  formatDistanceToNowVN,
  formatShortDate,
  formatTime,
} from '@/lib/format-date'
import { NotificationDetailDialog } from '@/features/patient/components/notifications/NotificationDetailDialog'
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
  useMarkNotificationAsUnread,
} from '@/features/patient/hooks/useNotificationQueries'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { cn } from '@/lib/utils'

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

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
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
              variant="icon"
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
            <DropdownMenuItem onClick={handleDelete}>
              Xóa thông báo này
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center justify-between gap-2 pr-5">
          <Badge
            variant={
              NOTIFICATION_TYPE_FILTERS[notification.type].variant as any
            }
            className="rounded-full text-xs">
            {NOTIFICATION_TYPE_FILTERS[notification.type].label}
          </Badge>

          <span className="flex items-center gap-1 text-xs text-slate-500 md:text-sm">
            <Clock className="size-4" />
            {formatDistanceToNowVN(notification.createdAt)}
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

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => deleteNotification(notification.id)}
        title="Xóa thông báo"
        description={`Bạn có chắc chắn muốn xóa thông báo "${notification.title}" nhận được vào lúc ${
          formatTime(notification.createdAt) +
          ' - ' +
          formatShortDate(notification.createdAt)
        } này không?`}
      />
    </>
  )
}
