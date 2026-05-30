import { Clock } from 'lucide-react'

import type { Notification } from '@/features/notifications/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatShortDate, formatTime } from '@/lib/format-date'
import { NOTIFICATION_TYPE_FILTERS } from '@/types/constants'

interface NotificationDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  notification: Notification | null
}

const extractFirstUrl = (value: string) => {
  const match = value.match(/https?:\/\/\S+/)
  return match?.[0]
}

export const NotificationDetailDialog = ({
  isOpen,
  onOpenChange,
  notification,
}: NotificationDetailDialogProps) => {
  if (!notification) return null

  let [content, url, reportUrl] = [notification.content, '', '']

  if (notification.content.includes('Mở tại:')) {
    ;[content, url] = notification.content.split('Mở tại:') as [string, string]
    reportUrl = extractFirstUrl(url) ?? ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="scrollbar-hide max-h-[80vh] overflow-y-auto rounded-4xl bg-white p-0 shadow-2xl md:max-w-lg lg:max-h-[90vh]"
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
                NOTIFICATION_TYPE_FILTERS[notification.type].variant ||
                'default'
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
            {content}{' '}
            {url && (
              <span className="text-teal-primary underline">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Mở liên kết tại đây
                </a>
              </span>
            )}
          </p>

          <div className="flex flex-col gap-2">
            {reportUrl && (
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full text-sm">
                <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                  Mở liên kết tải xuống
                </a>
              </Button>
            )}

            <Button
              type="button"
              variant="teal_primary"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-full text-sm active:scale-[0.98]">
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
