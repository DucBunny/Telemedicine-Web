import { createFileRoute } from '@tanstack/react-router'
import { CompleteProfilePage } from '@/features/patient/pages/CompleteProfilePage'

export const Route = createFileRoute('/patient/complete-profile')({
  component: CompleteProfilePage,
})
