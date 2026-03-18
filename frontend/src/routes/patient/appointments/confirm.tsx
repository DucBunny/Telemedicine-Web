import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { AppointmentConfirmPage } from '@/features/patient/pages/appointments/AppointmentConfirmPage'

const confirmSearchSchema = z.object({
  doctorId: z.number(),
  specialtyId: z.number(),
  date: z.string(),
  time: z.string(),
  type: z.enum(['offline', 'online']),
})

export const Route = createFileRoute('/patient/appointments/confirm')({
  validateSearch: confirmSearchSchema.partial(),
  component: AppointmentConfirmPage,
})
