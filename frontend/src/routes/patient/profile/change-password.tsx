import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordPage } from '@/features/patient/pages/profile/ChangePasswordPage'

export const Route = createFileRoute('/patient/profile/change-password')({
  component: ChangePasswordPage,
  staticData: {
    hideMobileNav: true,
  },
})
