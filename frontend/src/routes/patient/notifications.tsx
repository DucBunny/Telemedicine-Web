import { createFileRoute } from '@tanstack/react-router'

import { NotificationsPage } from '@/pages/patient/NotificationsPage'

export const Route = createFileRoute('/patient/notifications')({
  component: NotificationsPage,
  staticData: {
    hideMobileNav: true,
  },
})
