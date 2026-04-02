import { Clock } from 'lucide-react'
import type { Notification } from '@/features/patient/types'
import { NOTIFICATION_TYPE_FILTERS } from '@/features/patient/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatShortDate, formatTime } from '@/lib/format-date'

interface NotificationDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  notification: Notification | null
}

export const NotificationDetailDialog = ({
  isOpen,
  onOpenChange,
  notification,
}: NotificationDetailDialogProps) => {
  if (!notification) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden rounded-4xl bg-white p-0 shadow-2xl md:max-w-lg"
        showCloseButton={false}>
        <DialogHeader className="border-b border-gray-100 p-3 md:p-5 md:pb-4">
          <DialogTitle className="text-lg font-bold">
            Chi tiết thông báo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 p-5 pt-0 md:space-y-5">
          <div className="flex items-center justify-between gap-3">
            <Badge
              variant={
                NOTIFICATION_TYPE_FILTERS[notification.type].variant as any
              }
              className="rounded-full text-xs">
              {NOTIFICATION_TYPE_FILTERS[notification.type].label}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="size-4" />
              {formatTime(notification.createdAt) +
                ' - ' +
                formatShortDate(notification.createdAt)}
            </span>
          </div>

          <h3 className="text-xl leading-snug font-bold">
            {notification.title}
          </h3>

          <p className="text-sm leading-relaxed text-slate-600">
            {notification.content}
          </p>

          <Button
            type="button"
            variant="teal_primary"
            onClick={() => onOpenChange(false)}
            className="mt-2 w-full rounded-full text-sm active:scale-[0.98]">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
