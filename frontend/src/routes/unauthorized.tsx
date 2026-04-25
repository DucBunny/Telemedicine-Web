import { createFileRoute } from '@tanstack/react-router'

import { UnauthorizedPage } from '@/pages/public/UnauthorizedPage'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})
