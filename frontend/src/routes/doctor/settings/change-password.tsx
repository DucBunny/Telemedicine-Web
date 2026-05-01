import { createFileRoute } from '@tanstack/react-router'

import { ChangePasswordPage } from '@/pages/doctor/settings/ChangePasswordPage'

export const Route = createFileRoute('/doctor/settings/change-password')({
  component: ChangePasswordPage,
  staticData: {
    title: 'Đổi mật khẩu',
    hideMobileNav: true,
    hideHeader: true,
  },
})
