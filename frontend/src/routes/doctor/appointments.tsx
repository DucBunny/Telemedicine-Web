import { createFileRoute } from '@tanstack/react-router'
import { AppointmentsPage } from '@/features/doctor/pages/AppointmentsPage'

export const Route = createFileRoute('/doctor/appointments')({
  component: AppointmentsPage,
})
