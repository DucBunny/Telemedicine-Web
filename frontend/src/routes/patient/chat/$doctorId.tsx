import { createFileRoute } from '@tanstack/react-router'
import { ChatPage } from '@/features/patient/pages/ChatPage'

export const Route = createFileRoute('/patient/chat/$doctorId')({
  component: ChatPage,
  staticData: {
    hideMobileNav: true,
  },
})
