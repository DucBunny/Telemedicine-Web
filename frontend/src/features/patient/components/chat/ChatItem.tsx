import type { ChatMessage } from '@/features/patient/pages/ChatPage'
import { cn } from '@/lib/utils'

interface ChatItemProps {
  chat: ChatMessage
  onClick: (id: string) => void
}

export const ChatItem = ({ chat, onClick }: ChatItemProps) => {
  return (
    <div
      onClick={() => onClick(chat.id)}
      className="flex cursor-pointer items-center gap-3 rounded-xl py-3">
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
