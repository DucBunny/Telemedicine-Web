import { CalendarDays, Clock, MapPin, Video } from 'lucide-react'
import { useState } from 'react'
import type { Appointment } from '@/features/patient/types'
import { AppointmentDetailDialog } from '@/features/patient/components/appointments/AppointmentDetailDialog'
import { CancelAppointmentDialog } from '@/features/patient/components/appointments/CancelAppointmentDialog'
import { STATUS_FILTER_OPTIONS } from '@/features/patient/constants'
import { formatLongDate, formatTime } from '@/lib/format-date'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AppointmentCardProps {
  appointment: Appointment
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const isOnline = appointment.type === 'online'
  const statusOption = STATUS_FILTER_OPTIONS[appointment.status]
  const isShowCancelButton =
    appointment.status === 'cancelled' || appointment.status === 'completed'

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  return (
    <div className="teal700 relative flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800">
      {/* Doctor Info & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            className="ring-teal-primary/50 h-12 w-12 rounded-full border-2 border-white/40 ring-2"
            src={appointment.doctor?.user.avatar}
            alt={appointment.doctor?.user.fullName}
          />
          <div>
            <h3 className="text-base leading-tight font-bold dark:text-white">
              {appointment.doctor?.degree}. {appointment.doctor?.user.fullName}
            </h3>
            <p className="text-sm text-gray-600">
              {appointment.doctor?.specialty.name}
            </p>
          </div>
        </div>
        <Badge variant={(statusOption.variant as any) || 'default'}>
          {statusOption.label}
        </Badge>
      </div>

      {/* Appointment Info */}
      <div className="flex flex-col gap-2 rounded-xl bg-gray-500/5 p-3 text-slate-500 dark:bg-black/20">
        <div className="flex items-center gap-2 dark:text-gray-400">
          <CalendarDays className="size-4" />
          <span className="text-sm font-medium">
            {formatLongDate(appointment.scheduledAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 dark:text-gray-400">
          <Clock className="size-4" />
          <span className="text-sm font-medium">
            {formatTime(appointment.scheduledAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 dark:text-gray-400">
          {isOnline ? (
            <Video className="size-4" />
          ) : (
            <MapPin className="size-4" />
          )}

          <span className="text-sm font-medium">
            {isOnline
              ? 'Online'
              : appointment.doctor?.address || 'Địa điểm chưa xác định'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!isShowCancelButton && (
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl text-sm"
            onClick={() => setIsCancelDialogOpen(true)}>
            Hủy lịch
          </Button>
        )}
        <Button
          variant={isShowCancelButton ? 'secondary' : 'teal_primary'}
          size="lg"
          className="flex-1 rounded-xl text-sm"
          onClick={() => {
            setSelectedAppointment(appointment)
            setIsDetailDialogOpen(true)
          }}>
          {isShowCancelButton ? 'Xem chi tiết' : 'Chi tiết'}
        </Button>
      </div>

      <AppointmentDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={() => setIsDetailDialogOpen(false)}
        appointment={selectedAppointment}
      />

      <CancelAppointmentDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={() => setIsCancelDialogOpen(false)}
      />
    </div>
  )
}
