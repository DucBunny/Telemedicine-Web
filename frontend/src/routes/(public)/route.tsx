import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '@/features/auth/pages/AuthPage'

export const Route = createFileRoute('/(public)')({
  component: AuthLayoutRoute,
})

function AuthLayoutRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
