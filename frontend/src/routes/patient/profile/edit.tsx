import { createFileRoute } from '@tanstack/react-router'
import { EditProfilePage } from '@/features/patient/pages/profile/EditProfilePage'

export const Route = createFileRoute('/patient/profile/edit')({
  component: EditProfilePage,
  staticData: {
    hideMobileNav: true,
  },
})
