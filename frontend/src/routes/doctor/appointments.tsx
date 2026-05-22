import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { AppointmentsPage } from '@/pages/doctor/AppointmentsPage'

const appointmentsSearchSchema = z.object({
  status: z
    .enum(['confirmed', 'pending', 'upcoming', 'completed', 'cancelled'])
    .optional(),
  scheduledFrom: z.string().optional(),
  scheduledTo: z.string().optional(),
})

export const Route = createFileRoute('/doctor/appointments')({
  validateSearch: appointmentsSearchSchema,
  component: AppointmentsPage,
})
