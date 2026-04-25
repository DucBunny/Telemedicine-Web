import { createFileRoute } from '@tanstack/react-router'

import { EditProfilePage } from '@/pages/doctor/settings/EditProfilePage'

export const Route = createFileRoute('/doctor/settings/edit')({
  component: EditProfilePage,
  staticData: {
    hideMobileNav: true,
    hideHeader: true,
  },
})
