import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '@/pages/patient/ProfilePage'

export const Route = createFileRoute('/patient/profile/')({
  component: ProfilePage,
})
