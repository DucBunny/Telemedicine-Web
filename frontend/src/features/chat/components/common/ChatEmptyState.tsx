import { MessageCircleDashed } from 'lucide-react'

interface ChatEmptyStateProps {
  title?: string
  description?: string
}

export const ChatEmptyState = ({
  title = 'Chọn một cuộc trò chuyện để bắt đầu',
  description = 'Nhấn vào một cuộc hội thoại bên trái để xem tin nhắn',
}: ChatEmptyStateProps) => {
  return (
    <div className="flex h-full items-center justify-center px-4 text-center">
      <div className="space-y-3">
        <MessageCircleDashed
          className="mx-auto size-16 text-gray-400"
          strokeWidth="1.5"
        />
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-700">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}
