import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/patient/pages/HomePage'

export const Route = createFileRoute('/patient/')({
  component: HomePage,
})
