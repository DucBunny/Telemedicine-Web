import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useMediaQuery } from 'usehooks-ts'

import { ChatDesktopLayout } from '@/features/chat/components/common/ChatDesktopLayout'
import { ChatEmptyState } from '@/features/chat/components/common/ChatEmptyState'
import { ChatList, ChatRoom } from '@/features/chat/components/patient'
import { useAuthStore } from '@/stores/auth.store'
import { useChatSocketStore } from '@/stores/chatSocket.store'

export const ChatPage = () => {
  // Try to get conversationId from params (undefined if on index route)
  const params = useParams({ strict: false })
  const conversationId = params.conversationId
  const { connect, disconnect } = useChatSocketStore()
  const accessToken = useAuthStore((s) => s.accessToken)

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    if (!accessToken) {
      disconnect()
      return
    }

    connect()
    return () => disconnect()
  }, [accessToken, connect, disconnect])

  // Desktop: Show ChatDesktopLayout
  if (isDesktop)
    return (
      <ChatDesktopLayout
        leftPanel={<ChatList activeChatId={conversationId} />}
        rightPanel={conversationId ? <ChatRoom /> : <ChatEmptyState />}
      />
    )

  // Mobile: Show ChatList on index, ChatRoom on conversationId route
  return (
    <div className="h-full">{conversationId ? <ChatRoom /> : <ChatList />}</div>
  )
}
