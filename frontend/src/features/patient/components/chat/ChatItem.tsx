import type { ChatMessage } from '@/features/patient/components/chat/ChatList'
import { cn } from '@/lib/utils'

interface ChatItemProps {
  chat: ChatMessage
  onClick: (id: string) => void
  isActive?: boolean
}

export const ChatItem = ({ chat, onClick, isActive }: ChatItemProps) => {
  return (
    <div
      onClick={() => onClick(chat.id)}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors',
        isActive
          ? 'bg-teal-100/30 hover:bg-teal-100/60'
          : 'hover:bg-gray-100 active:bg-gray-200',
      )}>
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={chat.avatarUrl}
          alt={chat.doctorName}
          className="size-14 rounded-full bg-gray-200 object-cover"
        />
        <span
          className={cn(
            'absolute right-0.5 bottom-0.5 block size-3.5 rounded-full bg-green-500 ring-2 ring-white',
            !chat.isOnline && 'hidden',
          )}
        />
      </div>

      {/* Chat Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3
            className={cn(
              'truncate text-base',
              chat.hasUnread && 'font-semibold',
            )}>
            {chat.doctorName}
          </h3>
          <span className="ml-2 text-sm font-medium whitespace-nowrap">
            {chat.time}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p
            className={cn(
              'truncate text-sm',
              chat.hasUnread && 'font-semibold',
            )}>
            {chat.lastMessage}
          </p>
          {chat.hasUnread && (
            <span className="size-3 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
      </div>
    </div>
  )
}
