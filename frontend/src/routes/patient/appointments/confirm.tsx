import { createFileRoute } from '@tanstack/react-router'

import { AppointmentConfirmPage } from '@/pages/patient/appointments/AppointmentConfirmPage'

export const Route = createFileRoute('/patient/appointments/confirm')({
  component: AppointmentConfirmPage,
  staticData: {
    hideMobileNav: true,
  },
})
