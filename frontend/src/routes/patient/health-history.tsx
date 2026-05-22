import { createFileRoute } from '@tanstack/react-router'

import { HealthHistoryPage } from '@/pages/patient/HealthHistoryPage'

export const Route = createFileRoute('/patient/health-history')({
  component: HealthHistoryPage,
})
