import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/patient/pages/ProfilePage'

export const Route = createFileRoute('/patient/profile')({
  component: ProfilePage,
})
