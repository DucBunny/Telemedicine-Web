import { createFileRoute } from '@tanstack/react-router'

import { EditProfilePage } from '@/pages/doctor/settings/EditProfilePage'

export const Route = createFileRoute('/doctor/settings/edit')({
  component: EditProfilePage,
  staticData: {
    title: 'Chỉnh sửa thông tin',
    hideMobileNav: true,
    hideHeader: true,
  },
})
