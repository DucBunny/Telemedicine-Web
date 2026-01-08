import { createFileRoute } from '@tanstack/react-router'
import { AppointmentsPage } from '@/features/patient/pages/AppointmentsPage'

export const Route = createFileRoute('/patient/appointments')({
  component: AppointmentsPage,
})
