import { createFileRoute } from '@tanstack/react-router'

import type { AppointmentStatus } from '@/features/appointments/types'

import { appointmentApi } from '@/features/appointments/api/appointment.api'
import { APPOINTMENT_KEYS } from '@/features/appointments/hooks/useAppointmentQueries'
import { AppointmentsPage } from '@/pages/patient/AppointmentsPage'

export const Route = createFileRoute('/patient/appointments/')({
  loader: async ({ context: { queryClient } }) => {
    const params = {
      page: 1,
      limit: 5,
      status: ['confirmed', 'pending'] as Array<AppointmentStatus>,
    }

    await queryClient.ensureQueryData({
      queryKey: APPOINTMENT_KEYS.list(params),
      queryFn: () => appointmentApi.getMyAppointments(params),
    })
  },
  component: AppointmentsPage,
})
