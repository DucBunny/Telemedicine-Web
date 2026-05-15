import { useEffect, useState } from 'react'

import type { Appointment } from '@/features/appointments/types'

import { usePatchAppointmentStatus } from '@/features/appointments/hooks/useAppointmentQueries'
import { canDoctorPatchAppointmentStatus } from '@/features/appointments/utils/doctor-appointment-rules'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatShortDate, formatTime } from '@/lib/format-date'

interface AppointmentStatusCorrectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
}

export const AppointmentStatusCorrectionDialog = ({
  open,
  onOpenChange,
  appointment,
}: AppointmentStatusCorrectionDialogProps) => {
  const { mutateAsync: patchStatus, isPending } = usePatchAppointmentStatus()

  const [targetStatus, setTargetStatus] = useState<'completed' | 'cancelled'>(
    'completed',
  )
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    setTargetStatus('completed')
    setCancelReason('')
  }, [appointment?.id])

  if (!appointment || !['confirmed', 'cancelled'].includes(appointment.status))
    return null

  const canPatch = canDoctorPatchAppointmentStatus(appointment)

  const statusOptions =
    appointment.status === 'cancelled'
      ? [{ value: 'completed' as const, label: 'Đã hoàn thành' }]
      : [
          { value: 'completed' as const, label: 'Đã hoàn thành' },
          { value: 'cancelled' as const, label: 'Đã hủy (điều chỉnh)' },
        ]

  const handleSubmit = async () => {
    try {
      await patchStatus({
        id: appointment.id,
        payload:
          targetStatus === 'cancelled'
            ? { status: 'cancelled', cancelReason: cancelReason.trim() }
            : { status: 'completed' },
      })
      onOpenChange(false)
    } catch {
      /* toast trong hook */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-4xl"
        showCloseButton={false}
        aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {canPatch ? 'Đổi trạng thái lịch hẹn' : 'Không thể đổi trạng thái'}
          </DialogTitle>
        </DialogHeader>

        {!canPatch ? (
          <p className="text-muted-foreground text-sm leading-relaxed">
            Chỉ được chỉnh trong khoảng thời gian sau khi kết thúc ca khám (theo
            cấu hình máy chủ, thường trong vòng 48 giờ).
          </p>
        ) : (
          <div className="space-y-3 text-left">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">
                {appointment.patient?.user.fullName ?? 'Bệnh nhân'}
              </span>
              {' · '}
              {formatTime(appointment.scheduledAt)},{' '}
              {formatShortDate(appointment.scheduledAt)}
            </div>

            <div>
              <div className="text-sm">Trạng thái mới</div>
              <Select
                value={targetStatus}
                onValueChange={(v) =>
                  setTargetStatus(v as 'completed' | 'cancelled')
                }>
                <SelectTrigger className="mt-1 h-10! w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {targetStatus === 'cancelled' && (
              <div>
                <div className="text-sm">Lý do hủy</div>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-1 min-h-[72px] rounded-xl"
                  placeholder="Bắt buộc khi chọn hủy"
                  maxLength={500}
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="text-sm"
            onClick={() => onOpenChange(false)}>
            {canPatch ? 'Hủy' : 'Đóng'}
          </Button>
          {canPatch ? (
            <Button
              type="button"
              variant="teal_primary"
              className="text-sm"
              disabled={
                isPending ||
                (targetStatus === 'cancelled' && !cancelReason.trim())
              }
              onClick={() => void handleSubmit()}>
              {isPending ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
