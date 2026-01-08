import { createFileRoute } from '@tanstack/react-router'
import { NotificationsPage } from '@/features/patient/pages/NotificationsPage'

export const Route = createFileRoute('/patient/notifications')({
  component: NotificationsPage,
})
