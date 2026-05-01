import { createFileRoute } from '@tanstack/react-router'

import { TimeSelectionPage } from '@/pages/patient/appointments/TimeSelectionPage'

export const Route = createFileRoute('/patient/appointments/time')({
  component: TimeSelectionPage,
  staticData: {
    hideMobileNav: true,
  },
})
