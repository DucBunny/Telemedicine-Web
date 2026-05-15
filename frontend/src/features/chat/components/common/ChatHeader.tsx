import { ArrowLeft, Info, Phone, Video } from 'lucide-react'

import type { ChatUser } from '@/features/chat/types'

import { StatusAvatar } from '@/components/common/StatusAvatar'
import { Button } from '@/components/ui/button'
import { usePresenceStore } from '@/stores/presence.store'

interface ChatHeaderProps {
  otherParticipant?: ChatUser
  onBack: () => void
  onVideoCall?: () => void
}

export const ChatHeader = ({
  otherParticipant,
  onBack,
  onVideoCall,
}: ChatHeaderProps) => {
  const isUserOnline = usePresenceStore(
    (state) => !!state.onlineUsers[otherParticipant?.id ?? 0],
  )

  return (
    <div className="z-50 border-b border-gray-100 bg-white p-2 md:ml-20 lg:ml-0">
      <div className="flex w-full items-center justify-between gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden">
            <ArrowLeft className="size-5" />
          </Button>

          <StatusAvatar
            isUserOnline={isUserOnline}
            src={otherParticipant?.avatar}
            alt={otherParticipant?.fullName}
            className="size-10"
            sizeDot="sm"
          />

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold">
              {otherParticipant?.fullName}
            </h2>
            {isUserOnline && (
              <p className="text-xs text-slate-600">Đang hoạt động</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="text-teal-primary size-5 fill-current" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            disabled={!otherParticipant?.id || !onVideoCall}
            onClick={() => onVideoCall?.()}>
            <Video className="text-teal-primary size-6 fill-current" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Info className="fill-teal-primary size-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
