import { useParams } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import { ChatList, ChatRoom } from '@/features/patient/components/chat'

export const ChatPage = () => {
  // Try to get doctorId from params (undefined if on index route)
  const params = useParams({ strict: false })
  const doctorId = params.doctorId

  return (
    <>
      {/* Mobile/md: Show ChatPage on index, ChatRoomPage on doctorId route */}
      <div className="lg:hidden">{doctorId ? <ChatRoom /> : <ChatList />}</div>

      {/* lg: 2-column layout */}
      <div className="hidden lg:block">
        <div className="grid h-[calc(100vh-4rem)] grid-cols-12 divide-x overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Left: Chat List */}
          <div className="scrollbar-hide col-span-4 overflow-y-auto pt-4">
            <ChatList />
          </div>

          {/* Right: Chat Room or Empty State */}
          <div className="col-span-8 overflow-hidden">
            {doctorId ? <ChatRoom /> : <EmptyState />}
          </div>
        </div>
      </div>
    </>
  )
}

// Empty state component
const EmptyState = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center text-gray-500">
      <div className="space-y-3">
        <MessageCircle
          className="mx-auto size-16 text-gray-400"
          strokeWidth={1.5}
        />
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-700">
            Chọn một cuộc trò chuyện để bắt đầu
          </p>
          <p className="text-sm text-gray-500">
            Nhấn vào một bác sĩ bên trái để xem tin nhắn
          </p>
        </div>
      </div>
    </div>
  </div>
)
