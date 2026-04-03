import { CalendarDays, Clock, Stethoscope } from 'lucide-react'
import type { Doctor } from '@/features/patient/types'
import { Badge } from '@/components/ui/badge'

interface AppointmentConfirmInfoCardProps {
  doctor: Doctor
  appointment: {
    date: string
    time: string
    type: string
  }
}

export const AppointmentConfirmInfoCard = ({
  doctor,
  appointment,
}: AppointmentConfirmInfoCardProps) => {
  const initials = doctor.user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <section>
      {/* <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900  ">
        Thông tin đặt khám
      </h2> */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        {/* Doctor Info */}
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            {doctor.user.avatar ? (
              <img
                src={doctor.user.avatar ?? import.meta.env.VITE_DEFAULT_AVT}
                alt={doctor.user.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-teal-primary flex h-full w-full items-center justify-center bg-teal-100 text-xl font-bold">
                {initials}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-teal-primary text-xs font-semibold tracking-wider uppercase">
              Bác sĩ
            </span>
            <h3 className="text-lg leading-tight font-bold text-slate-900">
              {doctor.degree}. {doctor.user.fullName}
            </h3>
            <p className="text-sm text-slate-500">{doctor.specialty.name}</p>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3 text-slate-500">
              <CalendarDays className="text-teal-primary size-5.5" />
              <span className="text-sm font-medium">Ngày khám</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {appointment.date}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3 text-slate-500">
              <Clock className="text-teal-primary size-5.5" />
              <span className="text-sm font-medium">Giờ khám</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {appointment.time}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-slate-500">
              <Stethoscope className="text-teal-primary size-6" />
              <span className="text-sm font-medium">Loại khám</span>
            </div>
            <Badge variant="teal_outline" className="rounded-full text-xs">
              {appointment.type}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
