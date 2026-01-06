import { ChevronRight } from 'lucide-react'
import { MOCK_USER_DOCTOR } from '../../data/mockData'
import { StatCards } from './StatCards'
import { PatientsTable } from './PatientsTable'
import { UpcomingAppointments } from './UpcomingAppointments'
import { AlertsCard } from './AlertsCard'
import { Button } from '@/components/ui/button'

interface DashboardProps {
  onNavigate: (tab: string) => void
}

export const DashboardView = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Xin chào, {MOCK_USER_DOCTOR.full_name}
        </h1>
        <Button
          variant="ghost"
          onClick={() => onNavigate('appointments')}
          className="hidden items-center bg-teal-50 text-sm font-medium text-teal-600 hover:bg-teal-100 hover:text-teal-700 sm:flex">
          Xem lịch làm việc <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <StatCards />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          {/* Attention Patients Table */}
          <PatientsTable />

          {/* Upcoming Appointments */}
          <UpcomingAppointments onNavigate={onNavigate} />
        </div>

        {/* Alerts Column */}
        <div className="order-first lg:order-last lg:col-span-1">
          <AlertsCard />
        </div>
      </div>
    </div>
  )
}
