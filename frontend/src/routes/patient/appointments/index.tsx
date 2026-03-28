import { createFileRoute } from '@tanstack/react-router'
import { appointmentApi } from '@/features/patient/api/appointment.api'
import { APPOINTMENT_KEYS } from '@/features/patient/hooks/useAppointmentQueries'
import { AppointmentsPage } from '@/features/patient/pages/AppointmentsPage'

export const Route = createFileRoute('/patient/appointments/')({
  loader: async ({ context: { queryClient } }) => {
    const params = {
      page: 1,
      limit: 5,
      status: ['confirmed', 'pending'] as Array<string>,
    }

    await queryClient.ensureQueryData({
      queryKey: APPOINTMENT_KEYS.list(params),
      queryFn: () => appointmentApi.getMyAppointments(params),
    })
  },
  component: AppointmentsPage,
})
