import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'

import { ChatDesktopLayout } from '@/features/chat/components/common/ChatDesktopLayout'
import { ChatEmptyState } from '@/features/chat/components/common/ChatEmptyState'
import { ChatList, ChatRoom } from '@/features/chat/components/doctor'
import { useAuthStore } from '@/stores/auth.store'
import { useChatSocketStore } from '@/stores/chatSocket.store'

export const ChatPage = () => {
  // Try to get conversationId from params (undefined if on index route)
  const params = useParams({ strict: false })
  const conversationId = params.conversationId
  const { connect, disconnect } = useChatSocketStore()
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) {
      disconnect()
      return
    }

    connect()
    return () => disconnect()
  }, [accessToken, connect, disconnect])

  return (
    <>
      {/* Mobile/md: Show ChatPage on index, ChatRoomPage on conversationId route */}
      <div className="h-full pt-4 md:pt-0 lg:hidden">
        {conversationId ? <ChatRoom /> : <ChatList />}
      </div>

      {/* lg: 2-column layout */}
      <ChatDesktopLayout
        leftPanel={<ChatList activeChatId={conversationId} />}
        rightPanel={conversationId ? <ChatRoom /> : <ChatEmptyState />}
      />
    </>
  )
}
