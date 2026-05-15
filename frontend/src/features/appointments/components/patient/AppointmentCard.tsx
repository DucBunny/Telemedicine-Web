import { useState } from 'react'
import { CalendarDays, Clock, MapPin, Video } from 'lucide-react'

import type { Appointment } from '@/features/appointments/types'

import {
  AppointmentDetailDialog,
  CancelAppointmentDialog,
} from '@/features/appointments/components/patient'
import { useStartVideoCallFromAppointment } from '@/features/appointments/hooks/useStartVideoCallFromAppointment'
import { isAppointmentVideoCallButtonVisible } from '@/features/calls/utils/appointment-video-call-button-visible'
import { StatusAvatar } from '@/components/common/StatusAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatLongDate, formatTime } from '@/lib/format-date'
import { usePresenceStore } from '@/stores/presence.store'
import { APPOINTMENT_STATUS_FILTERS } from '@/types/constants'

interface AppointmentCardProps {
  appointment: Appointment
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const isUserOnline = usePresenceStore(
    (state) => !!state.onlineUsers[appointment.doctor?.userId ?? 0],
  )

  const isOnline = appointment.type === 'online'
  const statusOption = APPOINTMENT_STATUS_FILTERS[appointment.status]
  const isShowCancelButton =
    appointment.status === 'cancelled' || appointment.status === 'completed'

  const isShowVideoCallButton =
    appointment.type === 'online' &&
    appointment.status === 'confirmed' &&
    isAppointmentVideoCallButtonVisible(
      appointment.scheduledAt,
      appointment.durationMinutes,
    )

  const { startVideoCallFromAppointment, isStartingVideoCall } =
    useStartVideoCallFromAppointment('patient')

  // Dialog states
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800">
      {/* Doctor Info & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusAvatar
            isUserOnline={isUserOnline}
            src={appointment.doctor?.user.avatar}
            alt={appointment.doctor?.user.fullName}
            className="size-12"
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
        <Badge variant={statusOption.variant || 'default'}>
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
            className="min-w-0 flex-1 rounded-xl text-sm"
            onClick={() => setIsCancelDialogOpen(true)}>
            Hủy lịch
          </Button>
        )}

        <Button
          variant={isShowCancelButton ? 'secondary' : 'teal_primary'}
          size="lg"
          className="min-w-0 flex-1 rounded-xl text-sm"
          onClick={() => {
            setSelectedAppointment(appointment)
            setIsDetailDialogOpen(true)
          }}>
          {isShowCancelButton ? 'Xem chi tiết' : 'Chi tiết'}
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              hidden={!isShowVideoCallButton}
              disabled={isStartingVideoCall}
              className="min-w-0 rounded-xl text-sky-700 hover:bg-sky-50 hover:text-sky-800"
              onClick={() => startVideoCallFromAppointment(appointment)}>
              <Video className="size-4 shrink-0" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-24.5">
            Gọi video (khám online)
          </TooltipContent>
        </Tooltip>
      </div>

      <AppointmentDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={() => setIsDetailDialogOpen(false)}
        appointment={selectedAppointment}
      />

      <CancelAppointmentDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={() => setIsCancelDialogOpen(false)}
        appointmentId={appointment.id}
      />
    </div>
  )
}
