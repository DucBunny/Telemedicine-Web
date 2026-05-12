import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import type { DoctorStats } from '@/features/dashboard/types'
import type { Doctor } from '@/features/doctors/types'

import {
  useGetMyAppointments,
  useRealtimeAppointments,
} from '@/features/appointments/hooks/useAppointmentQueries'
import {
  AlertsCard,
  // PatientsTable,
  StatCards,
  UpcomingAppointments,
} from '@/features/dashboard/components/doctor'
import { useGetDashboardStats } from '@/features/dashboard/hooks/useGetStats'
import { useGetProfile } from '@/features/profile/hooks/useProfileQueries'
import LoaderScreen from '@/components/common/Loader'
import { Button } from '@/components/ui/button'

export const DashboardPage = () => {
  const { data: doctorProfile } = useGetProfile<Doctor>()
  const { data: appointmentsData } = useGetMyAppointments({
    page: 1,
    limit: 5,
    status: ['confirmed'],
  })
  useRealtimeAppointments()
  const { data: statsData, isLoading: isStatsLoading } =
    useGetDashboardStats<DoctorStats>()

  return (
    <div className="mx-auto space-y-3 p-4 md:space-y-6 md:p-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Xin chào, BS. {doctorProfile?.user.fullName}
        </h1>
        <Link to="/doctor/appointments">
          <Button variant="teal_secondary" className="hidden lg:flex">
            Xem lịch làm việc <ChevronRight className="size-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {isStatsLoading ? <LoaderScreen /> : <StatCards stats={statsData} />}

      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-3 md:space-y-6 lg:col-span-2">
          {/* Upcoming Appointments */}
          <UpcomingAppointments appointments={appointmentsData?.data} />
        </div>

        {/* Alerts Column */}
        <div className="order-first lg:order-last lg:col-span-1">
          <AlertsCard />
        </div>
      </div>
    </div>
  )
}
