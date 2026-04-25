import { useParams } from '@tanstack/react-router'

import { ChatDesktopLayout } from '@/features/chat/components/common/ChatDesktopLayout'
import { ChatEmptyState } from '@/features/chat/components/common/ChatEmptyState'
import { ChatList, ChatRoom } from '@/features/chat/components/patient'

export const ChatPage = () => {
  // Try to get conversationId from params (undefined if on index route)
  const params = useParams({ strict: false })
  const conversationId = params.conversationId

  return (
    <>
      {/* Mobile/md: Show ChatPage on index, ChatRoomPage on conversationId route */}
      <div className="h-full lg:hidden">
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
