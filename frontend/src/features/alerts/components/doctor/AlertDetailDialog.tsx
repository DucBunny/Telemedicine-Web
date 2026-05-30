import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Clock,
  Cpu,
  Droplets,
  Loader2,
  RefreshCw,
  UserCheck,
} from 'lucide-react'

import type { Alert } from '@/features/alerts/types'

import { useMarkAlertAsRead } from '@/features/alerts/hooks/useAlertQueries'
import { useHandleAlert } from '@/features/alerts/hooks/useHandleAlert'
import { StatusAvatar } from '@/components/common/StatusAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatLongDate, formatTime } from '@/lib/format-date'
import { selectUser, useAuthStore } from '@/stores/auth.store'
import { usePresenceStore } from '@/stores/presence.store'
import { ALERT_STATUS_FILTERS } from '@/types/constants'

const typeLabels: Record<string, string> = {
  bpm: 'Nhịp tim',
  spo2: 'SpO2',
}

interface AlertDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  alert: Alert | null
}

const formatAlertValue = (type: string, value: number) => {
  if (type === 'bpm') return `${value} BPM`
  if (type === 'spo2') return `${value}%`
  return String(value)
}

const AlertTypeIcon = ({ type }: { type: string }) => {
  if (type === 'spo2') {
    return <Droplets className="size-4 text-blue-500" />
  }
  return <Activity className="size-4 text-rose-500" />
}

export const AlertDetailDialog = ({
  isOpen,
  onOpenChange,
  alert: alertProp,
}: AlertDetailDialogProps) => {
  const doctor = useAuthStore(selectUser)
  const [alert, setAlert] = useState<Alert | null>(alertProp)
  const { mutate: markAsRead } = useMarkAlertAsRead()
  const { startHandlingAlert, isHandling } = useHandleAlert()

  useEffect(() => {
    setAlert(alertProp)
  }, [alertProp])

  useEffect(() => {
    if (!isOpen || !alert?.id) return
    markAsRead(alert.id)
  }, [isOpen, alert?.id, markAsRead])

  const isPatientOnline = usePresenceStore(
    (state) => !!state.onlineUsers[alert?.patient?.userId ?? 0],
  )

  if (!alert) return null

  const statusOption = ALERT_STATUS_FILTERS[alert.status]
  const typeLabel = typeLabels[alert.type] ?? alert.type.toUpperCase()
  const patientName = alert.patient?.user.fullName ?? 'Chưa xác định'
  const handlerName =
    alert.handledByDoctor?.user.fullName ?? 'Chưa có người xử lý'
  const isHandledByMe = alert.handledBy === doctor?.id
  const isHandledByOther =
    alert.status === 'handling' && alert.handledBy != null && !isHandledByMe

  const renderActionButton = () => {
    if (alert.status === 'resolved') return null

    if (isHandledByOther)
      return (
        <Button
          variant="outline"
          size="lg"
          disabled
          className="w-full rounded-full">
          Đang được xử lý bởi BS. {handlerName}
        </Button>
      )

    if (alert.status === 'handling' && isHandledByMe)
      return (
        <Button
          variant="teal_primary"
          size="lg"
          className="w-full rounded-full"
          disabled={isHandling}
          onClick={() => startHandlingAlert(alert)}>
          {isHandling ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Đang mở cuộc gọi...
            </>
          ) : (
            'Tiếp tục xử lý'
          )}
        </Button>
      )

    if (alert.status === 'pending')
      return (
        <Button
          variant="teal_primary"
          size="lg"
          className="w-full rounded-full"
          disabled={isHandling}
          onClick={() => startHandlingAlert(alert)}>
          {isHandling ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Đang nhận quyền xử lý...
            </>
          ) : (
            'Xử lý ngay'
          )}
        </Button>
      )

    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="scrollbar-hide max-h-[80vh] overflow-y-auto rounded-4xl bg-white p-0 lg:max-h-[90vh]"
        showCloseButton={false}>
        <DialogHeader className="border-b border-gray-100 p-3 md:p-5 md:pb-4 md:text-start">
          <DialogTitle className="text-lg font-bold">
            Chi tiết cảnh báo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 p-5 pt-0 md:space-y-5">
          <div className="flex items-center gap-4">
            <StatusAvatar
              isUserOnline={isPatientOnline}
              src={alert.patient?.user.avatar}
              alt={patientName}
              className="size-14"
            />
            <div className="flex-1">
              <h4 className="text-lg leading-tight font-semibold">
                {patientName}
              </h4>
              <p className="text-teal-primary mt-1 text-sm font-medium">
                Bệnh nhân #{alert.patientId}
              </p>
            </div>
          </div>

          <Badge
            variant={statusOption.variant ?? 'default'}
            className="rounded-full text-xs">
            {statusOption.label}
          </Badge>

          <div className="flex flex-col gap-1 rounded-2xl bg-gray-500/5 p-3 md:gap-3 md:p-4 dark:bg-black/20">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <AlertTypeIcon type={alert.type} />
              </div>
              <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                <span className="text-xs text-gray-600">Loại chỉ số</span>
                <span className="text-sm font-bold text-gray-900">
                  {typeLabel}
                </span>
              </div>
            </div>

            {['spo2', 'bpm'].includes(alert.type) && (
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Activity className="text-teal-primary size-4" />
                </div>
                <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                  <span className="text-xs text-gray-600">Giá trị đo</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatAlertValue(alert.type, alert.value)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Clock className="text-teal-primary size-4" />
              </div>
              <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                <span className="text-xs text-gray-600">
                  Thời gian cảnh báo
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {formatLongDate(alert.createdAt)} ·{' '}
                  {formatTime(alert.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <RefreshCw className="text-teal-primary size-4" />
              </div>
              <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                <span className="text-xs text-gray-600">Số lần bất thường</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">
                    {alert.anomalyCount} lần
                  </span>
                  {alert.anomalyCount >= 10 && (
                    <Badge variant="destructive">Nghiêm trọng</Badge>
                  )}
                  {alert.anomalyCount >= 5 && alert.anomalyCount < 10 && (
                    <Badge variant="warning">Cảnh báo</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Clock className="text-teal-primary size-4" />
              </div>
              <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                <span className="text-xs text-gray-600">
                  Lần bất thường gần nhất
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {formatLongDate(alert.lastDetectedAt)} ·{' '}
                  {formatTime(alert.lastDetectedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <UserCheck className="text-teal-primary size-4" />
              </div>
              <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                <span className="text-xs text-gray-600">Người xử lý</span>
                <span className="text-sm font-bold text-gray-900">
                  {handlerName}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Clock className="text-teal-primary size-4" />
              </div>
              <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                <span className="text-xs text-gray-600">Thời gian xử lý</span>
                <span className="text-sm font-bold text-gray-900">
                  {alert.status === 'resolved' && alert.resolvedAt
                    ? `${formatLongDate(alert.resolvedAt)} · ${formatTime(alert.resolvedAt)}`
                    : alert.status === 'pending'
                      ? 'Chưa xử lý'
                      : 'Đang xử lý'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Cpu className="text-teal-primary size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Thiết bị</span>
                <span className="text-sm font-bold text-gray-900">
                  Thiết bị #{alert.deviceId}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <AlertTriangle className="size-4 text-amber-500" />
              Nội dung cảnh báo
            </h5>
            <p className="rounded-xl border border-amber-200/70 bg-amber-500/5 p-3 text-sm leading-relaxed text-gray-900 md:p-4">
              {alert.message}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {renderActionButton()}
            <Button
              variant={alert.status === 'pending' ? 'outline' : 'teal_primary'}
              size="lg"
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
