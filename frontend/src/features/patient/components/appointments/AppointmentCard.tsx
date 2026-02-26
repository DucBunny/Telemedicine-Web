import { useRef, useState } from 'react'
import { User, Video } from 'lucide-react'
import { STATUS_FILTER_OPTIONS } from '../../config'
import { AppointmentDetailDialog } from './AppointmentDetailDialog'
import type { Appointment } from '../../types'
import { formatShortDate, formatTime } from '@/lib/format-date'

interface AppointmentCardProps {
  appointment: Appointment
}

export const AppointmentCard = ({
  appointment: appt,
}: AppointmentCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const pendingClick = useRef(false)

  const handleClick = () => {
    // mobile: single click
    if (window.innerWidth < 768) {
      setDialogOpen(true)
      return
    }
    // desktop: double click
    if (pendingClick.current) {
      pendingClick.current = false
      setDialogOpen(true)
    } else {
      pendingClick.current = true
      setTimeout(() => {
        pendingClick.current = false
      }, 500)
    }
  }

  const statusOption = STATUS_FILTER_OPTIONS.find(
    (s) => s.value === appt.status,
  )

  return (
    <>
      <div
        onClick={handleClick}
        className="flex cursor-pointer flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all select-none hover:shadow-md">
        <div className="mb-3 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <User size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">
              {appt.doctor?.user.fullName ?? 'Bác sĩ chưa xác định'}
            </h3>
            <p className="text-xs text-gray-500">
              {appt.doctor?.specialization ?? 'Chuyên khoa chưa xác định'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-teal-600">
              {formatTime(appt.scheduledAt)}
            </p>
            <p className="text-xs text-gray-400">
              {formatShortDate(appt.scheduledAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm">
          <span className="flex items-center text-gray-600">
            <Video size={16} className="mr-2 text-blue-500" />
            Online
          </span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              statusOption?.color ?? 'bg-gray-100 text-gray-900'
            }`}>
            {statusOption?.label ?? 'Chờ duyệt'}
          </span>
        </div>
      </div>

      <AppointmentDetailDialog
        appointment={appt}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
