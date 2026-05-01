import { createFileRoute } from '@tanstack/react-router'

import { DoctorSelectionPage } from '@/pages/patient/appointments/DoctorSelectionPage'

export const Route = createFileRoute('/patient/appointments/doctors')({
  component: DoctorSelectionPage,
})
