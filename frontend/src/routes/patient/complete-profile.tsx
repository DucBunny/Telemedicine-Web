import { createFileRoute } from '@tanstack/react-router'

import { CompleteProfilePage } from '@/pages/patient/CompleteProfilePage'

export const Route = createFileRoute('/patient/complete-profile')({
  component: CompleteProfilePage,
})
