import {
  CalendarDays,
  CalendarPlus,
  CalendarX,
  Clock,
  Info,
  MapPin,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { SpecialtyPickerDialog } from './SpecialtyPickerDialog'
import type { Appointment } from '@/features/patient/types'
import { STATUS_FILTER_OPTIONS } from '@/features/patient/config'
import { formatLongDate, formatTime } from '@/lib/format-date'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AppointmentDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
}

export const AppointmentDetailDialog = ({
  isOpen,
  onOpenChange,
  appointment,
}: AppointmentDetailDialogProps) => {
  if (!appointment) return null

  const isOnline = appointment.type === 'online'
  const statusOption = STATUS_FILTER_OPTIONS.find(
    (s) => s.value === appointment.status,
  )
  const isCancelled = appointment.status === 'cancelled'

  const [bookingOpen, setBookingOpen] = useState(false)
  const handleCreateNewAppointment = () => {
    setBookingOpen(true)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="rounded-4xl bg-white p-0"
          showCloseButton={false}>
          {/* Header */}
          {isCancelled ? (
            <DialogHeader className="border-b border-gray-100 p-3 md:p-5 md:pb-4">
              <div className="flex flex-col items-center">
                <div className="hidden size-12 items-center justify-center rounded-full bg-red-50 md:flex">
                  <CalendarX className="size-6 text-red-500" />
                </div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Lịch hẹn đã hủy
                </DialogTitle>
                <DialogDescription>
                  Lịch khám của bạn đã bị hủy.
                </DialogDescription>
              </div>
            </DialogHeader>
          ) : (
            <DialogHeader className="border-b border-gray-100 p-3 md:p-5 md:pb-4 md:text-start">
              <DialogTitle className="text-lg font-bold">
                Chi tiết lịch hẹn
              </DialogTitle>
            </DialogHeader>
          )}

          {/* Nội dung */}
          <div className="space-y-3 p-5 pt-0 md:space-y-5">
            {/* Thông tin Bác sĩ */}
            <div className="flex items-center gap-4">
              <img
                className="ring-teal-primary/50 size-14 rounded-full border-2 border-white/40 ring-2"
                src={appointment.doctor?.user.avatar}
                alt={appointment.doctor?.user.fullName}
              />
              <div className="flex-1">
                <h4 className="text-lg leading-tight font-semibold">
                  {appointment.doctor?.degree}.{' '}
                  {appointment.doctor?.user.fullName}
                </h4>
                <p className="text-teal-primary mt-1 text-sm font-medium">
                  {appointment.doctor?.specialty.name}
                </p>
              </div>
            </div>

            {/* Trạng thái - Chỉ hiển thị khi không phải cancelled */}
            {!isCancelled && (
              <Badge
                variant={(statusOption?.variant as any) || 'default'}
                className="rounded-full text-xs">
                {statusOption ? statusOption.label : 'Chờ duyệt'}
              </Badge>
            )}

            {/* Khối Thời gian & Địa điểm */}
            <div className="flex flex-col gap-1 rounded-2xl bg-gray-500/5 p-3 md:gap-3 md:p-4 dark:bg-black/20">
              {/* Ngày khám */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <CalendarDays className="text-teal-primary size-4" />
                </div>
                <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                  <span className="text-xs text-gray-600">Ngày khám</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatLongDate(appointment.scheduledAt)}
                  </span>
                </div>
              </div>

              {/* Thời gian */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Clock className="text-teal-primary size-4" />
                </div>
                <div className="flex flex-1 flex-col border-b border-gray-200 pb-2 md:pb-3">
                  <span className="text-xs text-gray-600">Thời gian</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatTime(appointment.scheduledAt)}
                  </span>
                </div>
              </div>

              {/* Địa điểm */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  {isOnline ? (
                    <Video className="text-teal-primary size-4" />
                  ) : (
                    <MapPin className="text-teal-primary size-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Địa điểm</span>
                  <span className="text-sm leading-snug font-bold text-gray-900">
                    {isOnline
                      ? 'Online'
                      : appointment.doctor?.address || 'Địa điểm chưa xác định'}
                  </span>
                </div>
              </div>
            </div>

            {/* Lý do khám hoặc Lý do hủy */}
            {isCancelled ? (
              <div className="rounded-xl border border-red-100 bg-red-500/5 p-3 md:p-4">
                <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-red-600 uppercase">
                  <Info className="size-4" /> Lý do hủy
                </div>
                <p className="text-sm leading-relaxed text-gray-900">
                  {appointment.cancelReason}
                </p>
              </div>
            ) : (
              <div>
                <h5 className="mb-2 text-sm font-semibold text-gray-900">
                  Lý do khám
                </h5>
                <p className="rounded-xl bg-gray-500/5 p-3 text-sm leading-relaxed text-gray-600 md:p-4">
                  {appointment.reason}
                </p>
              </div>
            )}

            {/* Nút Actions */}
            <div className="flex flex-col gap-2 pt-2">
              {isCancelled && (
                <Button
                  variant="teal_primary"
                  size="lg"
                  onClick={handleCreateNewAppointment}
                  className="w-full rounded-full text-sm active:scale-[0.98]">
                  <CalendarPlus />
                  Đặt lịch mới
                </Button>
              )}
              <Button
                variant={isCancelled ? 'outline' : 'teal_primary'}
                size="lg"
                onClick={() => onOpenChange(false)}
                className="w-full rounded-full text-sm active:scale-[0.98]">
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SpecialtyPickerDialog
        isOpen={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </>
  )
}
