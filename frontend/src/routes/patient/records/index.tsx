import { createFileRoute } from '@tanstack/react-router'

import { RecordsPage } from '@/pages/patient/RecordsPage'

export const Route = createFileRoute('/patient/records/')({
  component: RecordsPage,
})
