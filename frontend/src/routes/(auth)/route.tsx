import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '@/pages/public/AuthPage'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
})
