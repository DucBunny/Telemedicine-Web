import { createFileRoute } from '@tanstack/react-router'
import { PatientLayout } from '@/features/patient/layouts/PatientLayout'
import { PatientDashboardPage } from '@/features/patient/dashboard/PatientDashboardPage'

export const Route = createFileRoute('/patient/')({ component: PatientDashboard })

function PatientDashboard() {
  return (
    <PatientLayout>
      <PatientDashboardPage />
    </PatientLayout>
  )
}
