import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'

import {
  AppointmentsTable,
  DoctorCreateAppointmentDialog,
  Filters,
} from '@/features/appointments/components/doctor'
import {
  useGetMyAppointments,
  useRealtimeAppointments,
} from '@/features/appointments/hooks/useAppointmentQueries'
import { usePagination } from '@/hooks/usePagination'

export const AppointmentsPage = () => {
  const [createAppointmentOpen, setCreateAppointmentOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500) // 500ms delay before fetching

  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>(
    'all',
  )
  const [typeFilter, setTypeFilter] = useState<'all' | AppointmentType>('all')
  const [scheduledFrom, setScheduledFrom] = useState<string | undefined>()
  const [scheduledTo, setScheduledTo] = useState<string | undefined>()
  const p = usePagination({
    initialPage: 1,
    initialLimit: 5,
  })

  useRealtimeAppointments()

  const handleApplyFilters = ({
    statusFilter: nextStatusFilter,
    typeFilter: nextTypeFilter,
    scheduledFrom: nextScheduledFrom,
    scheduledTo: nextScheduledTo,
  }: {
    statusFilter: 'all' | AppointmentStatus
    typeFilter: 'all' | AppointmentType
    scheduledFrom?: string
    scheduledTo?: string
  }) => {
    setStatusFilter(nextStatusFilter)
    setTypeFilter(nextTypeFilter)
    setScheduledFrom(nextScheduledFrom)
    setScheduledTo(nextScheduledTo)
    p.reset()
  }

  const { data, isLoading, isError } = useGetMyAppointments({
    page: p.page,
    limit: p.limit,
    status: statusFilter === 'all' ? undefined : [statusFilter],
    type: typeFilter === 'all' ? undefined : typeFilter,
    scheduledFrom,
    scheduledTo,
    search: debouncedSearch,
  })

  useEffect(() => {
    p.reset()
  }, [debouncedSearch])

  return (
    <div className="space-y-3 p-4 md:space-y-6 md:p-0">
      {/* Filters & Actions */}
      <Filters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        scheduledFrom={scheduledFrom}
        scheduledTo={scheduledTo}
        onApplyFilters={handleApplyFilters}
        search={search}
        setSearch={setSearch}
        onOpenCreateAppointment={() => setCreateAppointmentOpen(true)}
      />

      {/* Appointments List */}
      <AppointmentsTable
        data={data}
        pagination={p}
        isLoading={isLoading}
        isError={isError}
      />

      <DoctorCreateAppointmentDialog
        open={createAppointmentOpen}
        onOpenChange={setCreateAppointmentOpen}
      />
    </div>
  )
}
