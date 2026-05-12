import { createFileRoute } from '@tanstack/react-router'

import { PatientsPage } from '@/pages/doctor/PatientsPage'

export const Route = createFileRoute('/doctor/patients/')({
  component: PatientsPage,
})
