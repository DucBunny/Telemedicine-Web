import { createFileRoute } from '@tanstack/react-router'
import { RecordsPage } from '@/features/patient/pages/RecordsPage'

export const Route = createFileRoute('/patient/records')({
  component: RecordsPage,
})
