import { createFileRoute } from '@tanstack/react-router'
import { ChatPage } from '@/features/doctor/pages/ChatPage'

export const Route = createFileRoute('/doctor/chat')({
  component: ChatPage,
})
