import { ChevronRight, Clock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { MOCK_APPOINTMENTS } from '../../data/mockData'
import { DoctorStatusBadge } from '../DoctorStatusBadge'
import { Button } from '@/components/ui/button'

export const UpcomingAppointments = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-green-50/50 p-3 md:p-5">
        <h2 className="flex items-center text-sm font-semibold text-gray-800 md:text-base">
          <Clock className="mr-2 h-4 w-4 text-teal-600 md:h-5 md:w-5" />
          Lịch hẹn sắp tới
        </h2>
        <Link to="/doctor/appointments">
          <Button
            variant="link"
            className="h-auto p-0 text-xs text-teal-600 md:text-sm">
            Xem tất cả
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {MOCK_APPOINTMENTS.slice(0, 3).map((appt) => (
          <div
            key={appt.id}
            className="flex items-center justify-between p-3 transition hover:bg-gray-50 md:p-3 md:pl-6">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="flex size-10 flex-col items-center justify-center rounded-lg bg-teal-50 text-teal-700 md:size-14">
                <span className="text-[10px] font-bold uppercase md:text-xs lg:text-sm">
                  {appt.time}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-900 md:text-sm">
                  {appt.patient_name}
                </h4>
                <p className="mt-0.5 flex flex-col text-[10px] text-gray-500 md:flex-row md:items-center md:gap-1 md:text-xs">
                  <span>{appt.type}</span>
                  <span className="hidden md:block">•</span>
                  {appt.reason}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <DoctorStatusBadge status={appt.status} />
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-gray-400 hover:bg-teal-50 hover:text-teal-600">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
