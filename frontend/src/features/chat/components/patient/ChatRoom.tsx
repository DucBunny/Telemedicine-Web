import { useNavigate, useParams } from '@tanstack/react-router'

import { ChatRoomBase } from '@/features/chat/components/common'

export const ChatRoom = () => {
  const navigate = useNavigate()
  const params = useParams({ from: '/patient/chat/$conversationId' })
  const conversationId = params.conversationId || ''

  return (
    <ChatRoomBase
      conversationId={conversationId}
      onBack={() => navigate({ to: '/patient/chat' })}
    />
  )
}
