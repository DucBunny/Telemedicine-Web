import { createFileRoute } from '@tanstack/react-router'
import { RecordDetailPage } from '@/features/patient/pages/records/RecordDetailPage'

export const Route = createFileRoute('/patient/records/$recordId')({
  component: RecordDetailPage,
})
