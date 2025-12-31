import { createFileRoute } from '@tanstack/react-router'
import { PatientAppointmentsPage } from '@/features/patient/pages/AppointmentsPage'

export const Route = createFileRoute('/patient/appointments')({ component: PatientAppointmentsPage })
