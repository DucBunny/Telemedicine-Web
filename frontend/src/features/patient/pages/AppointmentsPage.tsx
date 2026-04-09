import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AppointmentStatusFilter } from '@/features/patient/components/appointments/AppointmentStatusFilter'
import { useGetMyAppointments } from '@/features/patient/hooks/useAppointmentQueries'
import { AppointmentCard } from '@/features/patient/components/appointments/AppointmentCard'
import { SpecialtyPickerDialog } from '@/features/patient/components/appointments/SpecialtyPickerDialog'
import { MainPageHeader } from '@/features/patient/components/common/PageHeader'
import { Button } from '@/components/ui/button'

export const AppointmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState('upcoming')
  const [bookingOpen, setBookingOpen] = useState(false)

  const statusParam =
    statusFilter === 'upcoming' ? ['confirmed', 'pending'] : [statusFilter]

  const { data: appointmentsData } = useGetMyAppointments({
    page: 1,
    limit: 20,
    status: statusParam,
  })

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
