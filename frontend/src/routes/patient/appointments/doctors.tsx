import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DoctorSelectionPage } from '@/features/patient/pages/appointments/DoctorSelectionPage'

const doctorsSearchSchema = z.object({
  specialtyId: z.number(),
  specialtyName: z.string(),
})

export const Route = createFileRoute('/patient/appointments/doctors')({
  validateSearch: doctorsSearchSchema.partial(), // Partial: all fields are optional, allowing for more flexible navigation
  component: DoctorSelectionPage,
})
