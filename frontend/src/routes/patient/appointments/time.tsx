import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { TimeSelectionPage } from '@/features/patient/pages/appointments/TimeSelectionPage'

const timeSearchSchema = z.object({
  doctorId: z.number().int().positive(),
  specialtyId: z.number().int().positive(),
})

export const Route = createFileRoute('/patient/appointments/time')({
  validateSearch: timeSearchSchema.partial(),
  component: TimeSelectionPage,
  staticData: {
    hideMobileNav: true,
  },
})
