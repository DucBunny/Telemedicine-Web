import { useState } from 'react'
import { Filters } from '../components/appointments/Filters'
import { AppointmentsTable } from '../components/appointments/AppointmentsTable'
import { useGetDoctorAppointments } from '../hooks/useAppointmentQueries'
import { usePagination } from '@/hooks/usePagination'

export const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(' ')
  const p = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const { data, isLoading, isError } = useGetDoctorAppointments({
    page: p.page,
    limit: p.limit,
    status: statusFilter,
  })

  return (
    <div className="mx-auto space-y-4 md:space-y-6">
      {/* Filters & Actions */}
      <Filters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Appointments List */}
      <AppointmentsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        pagination={p}
      />
    </div>
  )
}
