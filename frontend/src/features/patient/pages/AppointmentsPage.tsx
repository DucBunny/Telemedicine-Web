import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useGetPatientAppointments } from '../hooks/useAppointmentQueries'
import { AppointmentCard } from '../components/appointments/AppointmentCard'
import { AppointmentStatusFilter } from '../components/appointments/AppointmentStatusFilter'
import { Button } from '@/components/ui/button'

export const AppointmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState('upcoming')

  const statusParam =
    statusFilter === 'upcoming' ? ['confirmed', 'pending'] : [statusFilter]

  const { data } = useGetPatientAppointments({
    page: 1,
    limit: 5,
    status: statusParam,
  })

  return (
    <div className="space-y-6 pt-4 pb-20 md:pt-0 md:pb-0">
      <div className="flex items-center justify-between px-1 pt-2 md:pt-0">
        <h1 className="text-2xl font-bold text-gray-900">Lịch khám</h1>
        <Button variant="teal_primary" size="icon-lg" className="rounded-full">
          <Plus size={24} />
        </Button>
      </div>

      <AppointmentStatusFilter
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <div className="space-y-4">
        {data && data.data.length > 0 ? (
          data.data.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))
        ) : (
          <p className="text-center text-gray-500">Không có lịch hẹn nào.</p>
        )}
      </div>
    </div>
  )
}
