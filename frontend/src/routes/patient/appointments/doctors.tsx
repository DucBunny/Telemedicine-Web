import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { DoctorSelectionPage } from '@/pages/patient/appointments/DoctorSelectionPage'

const doctorsSearchSchema = z.object({
  specialtyId: z.number().int().positive(),
})

export const Route = createFileRoute('/patient/appointments/doctors')({
  validateSearch: doctorsSearchSchema.partial(),
  component: DoctorSelectionPage,
})
