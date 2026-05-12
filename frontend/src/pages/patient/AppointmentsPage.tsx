import { useState } from 'react'
import { Plus } from 'lucide-react'

import type { AppointmentStatus } from '@/features/appointments/types'

import {
  AppointmentCard,
  AppointmentStatusFilter,
  SpecialtyPickerDialog,
} from '@/features/appointments/components/patient'
import {
  useGetMyAppointments,
  useRealtimeAppointments,
} from '@/features/appointments/hooks/useAppointmentQueries'
import LoaderScreen from '@/components/common/Loader'
import { MainPageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'

export const AppointmentsPage = () => {
  const [statusFilter, setStatusFilter] =
    useState<AppointmentStatus>('upcoming')
  const [bookingOpen, setBookingOpen] = useState(false)

  const statusParam: Array<AppointmentStatus> =
    statusFilter === 'upcoming' ? ['confirmed', 'pending'] : [statusFilter]

  const {
    data: appointmentsData,
    isLoading,
    isError,
  } = useGetMyAppointments({
    page: 1,
    limit: 20,
    status: statusParam,
  })

  useRealtimeAppointments()

  if (isLoading) return <LoaderScreen />

  if (isError) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-gray-100 bg-white">
        <div className="text-red-500">Lỗi khi tải danh sách bệnh nhân</div>
      </div>
    )
  }

  return (
    <div className="px-4">
      {/* Header */}
      <MainPageHeader
        title="Lịch khám"
        rightAction={
          <Button
            variant="teal_primary"
            size="icon-lg"
            className="rounded-full active:scale-95"
            onClick={() => setBookingOpen(true)}>
            <Plus className="size-5" />
          </Button>
        }
      />

      {/* Filter */}
      <AppointmentStatusFilter
        value={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Danh sách lịch khám */}
      <div className="grid gap-3 overflow-y-auto px-1 py-3 md:gap-4 md:py-6 lg:grid-cols-2">
        {appointmentsData?.data && appointmentsData.data.length > 0 ? (
          appointmentsData.data.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))
        ) : (
          <p className="py-6 text-center text-gray-500 lg:col-span-2">
            Không có lịch hẹn nào.
          </p>
        )}
      </div>

      <SpecialtyPickerDialog
        isOpen={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  )
}
