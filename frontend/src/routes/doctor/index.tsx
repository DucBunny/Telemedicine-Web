import { createFileRoute } from '@tanstack/react-router'
import { DoctorLayout } from '@/features/doctor/layouts/DoctorLayout'
import { DoctorDashboardPage } from '@/features/doctor/dashboard/DashboardPage'

export const Route = createFileRoute('/doctor/')({ component: DoctorDashboard })

function DoctorDashboard() {
  return (
    <DoctorLayout>
      <DoctorDashboardPage />
    </DoctorLayout>
  )
}
