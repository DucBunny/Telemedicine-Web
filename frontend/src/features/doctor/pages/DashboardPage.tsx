import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  AlertsCard,
  PatientsTable,
  StatCards,
  UpcomingAppointments,
} from '../components/dashboard'
import { useGetDoctorProfile } from '../hooks/useDoctorQueries'
import { Button } from '@/components/ui/button'

export const DashboardPage = () => {
  const { data } = useGetDoctorProfile()

  return (
    <div className="mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Xin chào, BS.{data?.user.fullName}
        </h1>
        <Link to="/doctor/appointments">
          <Button
            variant="ghost"
            className="hidden bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700 lg:flex">
            Xem lịch làm việc <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatCards />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          {/* Attention Patients Table */}
          <PatientsTable />

          {/* Upcoming Appointments */}
          <UpcomingAppointments />
        </div>

        {/* Alerts Column */}
        <div className="order-first lg:order-last lg:col-span-1">
          <AlertsCard />
        </div>
      </div>
    </div>
  )
}
