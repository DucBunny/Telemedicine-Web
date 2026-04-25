import { useState } from 'react'
import { CalendarDays, Clock, Hospital, Video } from 'lucide-react'

import type { Appointment } from '@/features/appointments/types'

import { AppointmentDetailDialog } from '@/features/appointments/components/patient'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatShortDate, formatTime } from '@/lib/format-date'

interface AppointmentCardProps {
  appointment: Appointment
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const isOnline = appointment.type === 'online'

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  return (
    <div className="rounded-xl border border-l-4 border-gray-100 border-l-teal-500 bg-white p-4 ring-1 ring-slate-100">
      <div className="mb-3 border-b border-gray-100 pb-3">
        {/* Name & Time */}
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-gray-900">
            {appointment.doctor?.degree}. {appointment.doctor?.user.fullName}
          </h4>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock size={16} className="text-teal-primary" />
            {formatTime(appointment.scheduledAt)}
          </div>
        </div>

        {/* Specialty & Date */}
        <div className="flex items-center justify-between text-gray-600">
          <p className="text-sm">{appointment.doctor?.specialty.name}</p>
          <div className="flex items-center gap-1 text-xs">
            <CalendarDays size={16} className="text-teal-primary" />
            {formatShortDate(appointment.scheduledAt)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Badge
          variant={isOnline ? 'orange_blur' : 'green_blur'}
          className="text-xs">
          {isOnline ? (
            <Video className="size-4!" />
          ) : (
            <Hospital className="size-4!" />
          )}
          {isOnline ? 'Online' : 'Trực tiếp'}
        </Badge>
        <Button
          variant="teal_outline"
          className="h-7 md:text-xs"
          size="sm"
          onClick={() => {
            setSelectedAppointment(appointment)
            setIsDetailDialogOpen(true)
          }}>
          Chi tiết
        </Button>
      </div>

      <AppointmentDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={() => setIsDetailDialogOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  )
}
