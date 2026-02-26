import { useState } from 'react'
import { Calendar, Clock, Video } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AppointmentDetailDialog } from '../appointments/AppointmentDetailDialog'
import type { Appointment } from '../../types'
import { Button } from '@/components/ui/button'

interface UpcomingAppointmentProps {
  appointmentsData: Array<Appointment> | undefined
}

export const UpcomingAppointment = ({
  appointmentsData,
}: UpcomingAppointmentProps) => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDetail = (appt: Appointment) => {
    setSelectedAppointment(appt)
    setDialogOpen(true)
  }

  return (
    <div className="px-0 md:px-0">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-800">Lịch hẹn sắp tới</h2>
        <Link to="/patient/appointments">
          <Button variant="link" className="p-0 text-xs text-teal-600">
            Xem tất cả
          </Button>
        </Link>
      </div>

      {appointmentsData && appointmentsData.length > 0 ? (
        appointmentsData.slice(0, 1).map((appt) => (
          <div
            key={appt.id}
            className="relative rounded-2xl border border-l-4 border-gray-100 border-l-teal-500 bg-white p-5 shadow-sm">
            {/* Doctor info */}
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {appt.doctor?.user.fullName ?? 'Bác sĩ chưa xác định'}
                </h3>
                <p className="mt-0.5 text-sm text-teal-600">
                  {appt.doctor?.specialization ?? 'Chuyên khoa chưa xác định'}
                </p>
              </div>
              <span className="rounded bg-teal-50 px-2 py-1 text-[10px] font-bold tracking-wide text-teal-700 uppercase">
                Online
              </span>
            </div>

            {/* Date & Time */}
            <div className="mb-4 flex items-center space-x-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1.5 text-gray-400" />
                {new Date(appt.scheduledAt.split(' ')[0]).toLocaleDateString(
                  'vi-VN',
                )}
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1.5 text-gray-400" />
                {new Date(
                  `1970-01-01T${appt.scheduledAt.split(' ')[1]}`,
                ).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="teal_primary"
                size="lg"
                className="flex-3 rounded-xl text-xs"
                onClick={() => handleOpenDetail(appt)}>
                Chi tiết
              </Button>

              {/* {appt.type === 'Online' && ( */}
              <Button
                size="lg"
                className="flex-1 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                asChild>
                <a
                  href={appt.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Video size={16} />
                  <span className="hidden sm:block">Tham gia</span>
                </a>
              </Button>
              {/* )} */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">
          Không có lịch hẹn nào sắp tới.
        </p>
      )}

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
