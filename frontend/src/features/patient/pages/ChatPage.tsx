import { useParams } from '@tanstack/react-router'
import { MessageCircleDashed } from 'lucide-react'
import { ChatList, ChatRoom } from '@/features/patient/components/chat'

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
      <div className="hidden lg:block">
        <div className="grid h-[calc(100vh-4rem)] grid-cols-12 divide-x overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Left: Chat List */}
          <div className="col-span-5 overflow-y-auto pt-4 xl:col-span-4">
            <ChatList activeChatId={conversationId} />
          </div>

          {/* Right: Chat Room or Empty State */}
          <div className="col-span-7 overflow-hidden xl:col-span-8">
            {conversationId ? <ChatRoom /> : <EmptyState />}
          </div>
        </div>
      </div>
    </>
  )
}

// Empty state component
const EmptyState = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <div className="space-y-3">
        <MessageCircleDashed
          className="mx-auto size-16 text-gray-400"
          strokeWidth="1.5"
        />
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-700">
            Chọn một cuộc trò chuyện để bắt đầu
          </p>
          <p className="text-sm text-gray-500">
            Nhấn vào một cuộc hội thoại bên trái để xem tin nhắn
          </p>
        </div>
      </div>
    </div>
  </div>
)
