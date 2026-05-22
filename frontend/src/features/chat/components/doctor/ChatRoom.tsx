import { useNavigate, useParams, useSearch } from '@tanstack/react-router'

import { ChatRoomBase } from '@/features/chat/components/common'

export const ChatRoom = () => {
  const navigate = useNavigate({ from: '/doctor/chat/$conversationId' })
  const params = useParams({ from: '/doctor/chat/$conversationId' })
  const { startVideo, fromAlert } = useSearch({
    from: '/doctor/chat/$conversationId',
  })
  const conversationId = params.conversationId || ''

  return (
    <ChatRoomBase
      conversationId={conversationId}
      onBack={() => navigate({ to: '/doctor/chat' })}
      autoStartVideoFromAppointment={!!startVideo && !fromAlert}
      autoStartVideoFromAlert={!!startVideo && !!fromAlert}
      onAutoStartVideoSearchConsumed={() =>
        navigate({
          to: '/doctor/chat/$conversationId',
          params: { conversationId },
          search: {},
          replace: true,
        })
      }
    />
  )
}
