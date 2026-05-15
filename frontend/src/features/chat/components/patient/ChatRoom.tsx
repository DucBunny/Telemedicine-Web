import { useNavigate, useParams, useSearch } from '@tanstack/react-router'

import { ChatRoomBase } from '@/features/chat/components/common'

export const ChatRoom = () => {
  const navigate = useNavigate({ from: '/patient/chat/$conversationId' })
  const params = useParams({ from: '/patient/chat/$conversationId' })
  const { startVideo } = useSearch({ from: '/patient/chat/$conversationId' })
  const conversationId = params.conversationId || ''

  return (
    <ChatRoomBase
      conversationId={conversationId}
      onBack={() => navigate({ to: '/patient/chat' })}
      autoStartVideoFromAppointment={!!startVideo}
      onAutoStartVideoSearchConsumed={() =>
        navigate({
          to: '/patient/chat/$conversationId',
          params: { conversationId },
          search: {},
          replace: true,
        })
      }
    />
  )
}
