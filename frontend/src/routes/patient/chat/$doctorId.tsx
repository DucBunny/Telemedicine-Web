import { createFileRoute } from '@tanstack/react-router'
import { ChatRoomPage } from '@/features/patient/pages/chat/ChatRoomPage'

export const Route = createFileRoute('/patient/chat/$doctorId')({
  component: ChatRoomPage,
})
