import type { ChatConversation } from '@/features/chat/types'

import { StatusAvatar } from '@/components/common/StatusAvatar'
import { formatDistanceToNowWithSeconds } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { usePresenceStore } from '@/stores/presence.store'

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
  const hasUnread = conversation.unreadCount > 0 && !isActive
  const isUserOnline = usePresenceStore(
    (state) => !!state.onlineUsers[conversation.user.id],
  )

  return (
    <div
      onClick={() => onClick(conversation.id)}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-xl px-2 py-3 transition-colors',
        isActive
          ? 'bg-teal-100/30 hover:bg-teal-100/60'
          : 'hover:bg-gray-100 active:bg-gray-200',
      )}>
      {/* Avatar */}
      <StatusAvatar
        isUserOnline={isUserOnline}
        src={conversation.user.avatar}
        alt={conversation.user.fullName}
        className="size-14"
      />

      {/* Chat Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3
            className={cn('truncate text-base', hasUnread && 'font-semibold')}>
            {conversation.user.fullName}
          </h3>
          <span className="ml-2 text-sm font-medium whitespace-nowrap">
            {formatDistanceToNowWithSeconds(
              conversation.lastMessage?.createdAt ?? '',
            )}
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
