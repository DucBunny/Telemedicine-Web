import { Clock } from 'lucide-react'
import type { NotificationCategory, NotificationItemData } from '../../data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface NotificationDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  notification: NotificationItemData | null
}

export const NotificationDetailDialog = ({
  isOpen,
  onOpenChange,
  notification,
}: NotificationDetailDialogProps) => {
  if (!notification) return null

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm overflow-hidden rounded-4xl bg-white p-0 shadow-2xl md:max-w-lg"
        showCloseButton={false}>
        <DialogHeader className="border-b border-gray-100 p-3 md:p-5 md:pb-4">
          <DialogTitle className="text-lg font-bold">
            Chi tiết thông báo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 p-5 pt-0 md:space-y-5">
          <div className="flex items-center justify-between gap-3">
            <Badge
              variant={getCategoryStyles(notification.category)}
              className="rounded-full text-xs">
              {notification.category}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="size-4" />
              {notification.time}
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
