import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Clock, Hospital, Video } from 'lucide-react'

import type { Appointment } from '@/features/appointments/types'

import { AppointmentDetailDialog } from '@/features/appointments/components/doctor'
import { SafeImage } from '@/components/common/SafeImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRelativeDate, formatTime } from '@/lib/format-date'

interface UpcomingAppointmentsProps {
  appointments: Array<Appointment> | undefined
}

export const UpcomingAppointments = ({
  appointments,
}: UpcomingAppointmentsProps) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-green-50/50 p-3 md:p-5">
        <h2 className="flex items-center text-sm font-semibold text-gray-800 md:text-base">
          <Clock className="text-teal-primary mr-2 h-4 w-4 md:h-5 md:w-5" />
          Lịch hẹn sắp tới
        </h2>
        <Link
          to="/doctor/appointments"
          search={{
            status: 'confirmed',
          }}>
          <Button
            variant="link"
            className="text-teal-primary h-auto p-0 text-xs md:text-sm">
            Xem tất cả
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {appointments?.map((appt) => {
          const isOnline = appt.type === 'online'

          return (
            <div
              key={appt.id}
              className="flex items-center justify-between p-3 transition hover:bg-gray-50 md:pl-6"
              onDoubleClick={() => {
                setSelectedAppointment(appt)
                setIsDetailDialogOpen(true)
              }}>
              <div className="flex items-center space-x-3 md:space-x-4">
                <SafeImage
                  src={appt.patient?.user.avatar}
                  alt={appt.patient?.user.fullName}
                  className="size-10 rounded-lg bg-teal-50 md:size-14"
                />

                <div className="flex flex-col gap-0.5">
                  <h4 className="text-sm font-semibold text-gray-900 md:text-base">
                    {appt.patient?.user.fullName}
                  </h4>

                  <p className="text-xs text-gray-500 md:text-sm">
                    <span>
                      {formatRelativeDate(appt.scheduledAt)},{' '}
                      {formatTime(appt.scheduledAt)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
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
                  variant="ghost"
                  size="icon-sm"
                  className="hover:text-teal-primary text-gray-500 hover:bg-teal-50"
                  onClick={() => {
                    setSelectedAppointment(appt)
                    setIsDetailDialogOpen(true)
                  }}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <AppointmentDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={() => setIsDetailDialogOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  )
}
