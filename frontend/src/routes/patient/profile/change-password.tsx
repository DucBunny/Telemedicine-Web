import { createFileRoute } from '@tanstack/react-router'

import { ChangePasswordPage } from '@/pages/patient/profile/ChangePasswordPage'

export const Route = createFileRoute('/patient/profile/change-password')({
  component: ChangePasswordPage,
  staticData: {
    hideMobileNav: true,
  },
})
