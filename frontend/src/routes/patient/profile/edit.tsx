import { createFileRoute } from '@tanstack/react-router'

import { EditProfilePage } from '@/pages/patient/profile/EditProfilePage'

export const Route = createFileRoute('/patient/profile/edit')({
  component: EditProfilePage,
  staticData: {
    hideMobileNav: true,
  },
})
