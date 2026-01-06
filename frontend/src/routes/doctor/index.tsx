import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/features/doctor/pages/DashboardPage'

export const Route = createFileRoute('/doctor/')({
  component: DashboardPage,
})
