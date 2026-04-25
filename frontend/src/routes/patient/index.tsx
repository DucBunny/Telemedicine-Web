import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/pages/patient/HomePage'

export const Route = createFileRoute('/patient/')({
  component: HomePage,
})
