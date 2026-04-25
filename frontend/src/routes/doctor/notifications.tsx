import { createFileRoute } from '@tanstack/react-router'

import { NotificationsPage } from '@/pages/doctor/NotificationsPage'

export const Route = createFileRoute('/doctor/notifications')({
  component: NotificationsPage,
  staticData: {
    hideMobileNav: true,
    hideHeader: true,
  },
})
