import { createFileRoute } from '@tanstack/react-router'

import { AppointmentsPage } from '@/pages/doctor/AppointmentsPage'

export const Route = createFileRoute('/doctor/appointments')({
  component: AppointmentsPage,
})
