import { createFileRoute } from '@tanstack/react-router'
import { UnauthorizedPage } from '@/features/auth/pages/UnauthorizedPage'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})
