import type { ChatConversation } from '@/features/patient/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNowVN } from '@/lib/format-date'

interface ChatItemProps {
  conversation: ChatConversation
  onClick: (id: string) => void
  isActive?: boolean
}

export const ChatItem = ({
  conversation,
  onClick,
  isActive,
}: ChatItemProps) => {
  const hasUnread = conversation.unreadCount > 0
  const lastMessageTime = formatDistanceToNowVN(
    conversation.lastMessage?.createdAt ?? '',
  )

  return (
    <div
      onClick={() => onClick(conversation.id)}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors',
        isActive
          ? 'bg-teal-100/30 hover:bg-teal-100/60'
          : 'hover:bg-gray-100 active:bg-gray-200',
      )}>
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={conversation.user.avatar ?? import.meta.env.VITE_DEFAULT_AVT}
          alt={conversation.user.fullName}
          className="size-14 rounded-full bg-gray-200 object-cover"
        />
      </div>

      {/* Chat Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3
            className={cn('truncate text-base', hasUnread && 'font-semibold')}>
            {conversation.user.fullName}
          </h3>
          <span className="ml-2 text-sm font-medium whitespace-nowrap">
            {lastMessageTime}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className={cn('truncate text-sm', hasUnread && 'font-semibold')}>
            {conversation.lastMessage?.message || 'Chưa có tin nhắn'}
          </p>
          {hasUnread && (
            <span className="size-3 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
      </div>
    </div>
  )
}
