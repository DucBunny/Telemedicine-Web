import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from '@/pages/doctor/DashboardPage'

export const Route = createFileRoute('/doctor/')({
  component: DashboardPage,
})
