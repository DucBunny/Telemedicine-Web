import { Plus } from 'lucide-react'

import type { ChatConversation } from '@/features/chat/types'

import { StatusAvatar } from '@/components/common/StatusAvatar'
import { cn } from '@/lib/utils'
import { usePresenceStore } from '@/stores/presence.store'

interface RecentUsersListProps {
  conversations: Array<ChatConversation>
  onClick: (conversationId: string) => void
  onBookAction?: () => void
}

export const RecentUsersList = ({
  conversations,
  onClick,
  onBookAction,
}: RecentUsersListProps) => {
  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto pt-1 lg:hidden">
      {/* Nút Tạo mới */}
      {onBookAction && (
        <div className="ms-4 flex min-w-15 cursor-pointer flex-col items-center gap-1 transition-opacity hover:opacity-80">
          <div className="relative">
            <div
              className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-100"
              onClick={onBookAction}>
              <Plus className="size-6 text-gray-400" />
            </div>
          </div>
          <span className="max-w-15 truncate text-center text-xs font-medium">
            Tạo mới
          </span>
        </div>
      )}

      {/* Danh sách người dùng */}
      {conversations.map((conv) => {
        const isUserOnline = usePresenceStore(
          (state) => !!state.onlineUsers[conv.user.id],
        )

        const nameParts = conv.user.fullName.split(' ')
        const firstName = nameParts[nameParts.length - 1]

        return (
          <div
            key={conv.id}
            className={cn(
              'flex min-w-15 cursor-pointer flex-col items-center gap-1 transition-opacity last:me-4 hover:opacity-80 md:last:me-20 lg:last:me-4',
              !onBookAction && 'first:ms-4',
            )}>
            <StatusAvatar
              isUserOnline={isUserOnline}
              src={conv.user.avatar}
              alt={conv.user.fullName}
              className="size-14"
              onClick={() => onClick(conv.id)}
            />
            <span className="max-w-15 truncate text-center text-xs font-medium">
              {firstName}
            </span>
          </div>
        )
      })}
    </div>
  )
}
