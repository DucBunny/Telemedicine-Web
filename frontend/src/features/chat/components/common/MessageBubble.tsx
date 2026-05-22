import { useState } from 'react'
import { Download, FileText, FileX, Video } from 'lucide-react'
import { toast } from 'sonner'

import type { ChatMessage } from '@/features/chat/types'

import { SafeImage } from '@/components/common/SafeImage'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { selectUser, useAuthStore } from '@/stores/auth.store'

interface MessageBubbleProps {
  message: ChatMessage
  isFirst?: boolean
  isLast?: boolean
}

const CALL_STATUS_LABELS = {
  rejected: 'Cuộc gọi video - Từ chối',
  missed: 'Cuộc gọi video - Nhỡ máy',
  completed: 'Cuộc gọi video - Đã kết thúc',
}

export const MessageBubble = ({
  message,
  isFirst = false,
  isLast = false,
}: MessageBubbleProps) => {
  const currentUser = useAuthStore(selectUser)
  const isSelf = message.sender.id === currentUser?.id
  const [imageError, setImageError] = useState(false)

  const messageTime = formatTime(message.createdAt)

  const handleImageClick = (url: string) => {
    window.open(url, '_blank')
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('[Chat] Download Error:', error)
      toast.error('Tải file thất bại')
    }
  }

  // Render image message
  const renderImageContent = (fileUrl: string) => (
    <div className="max-w-xs rounded-2xl shadow-sm">
      {!imageError ? (
        <img
          src={fileUrl}
          alt={message.content.file_name || 'image'}
          className="cursor-pointer rounded-2xl"
          onClick={() => handleImageClick(fileUrl)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-2xl bg-gray-100 p-3">
          <FileX className="size-5 text-gray-500" />
          <span className="text-sm text-gray-600">Không thể tải ảnh</span>
        </div>
      )}
    </div>
  )

  // Render file message
  const renderFileContent = (fileUrl: string, fileName?: string) => {
    const displayName = fileName || 'file'
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl px-3 py-1.5',
          isSelf ? 'bg-teal-primary text-white' : 'text-teal-primary bg-white',
        )}>
        <FileText className="size-6 shrink-0" />
        <p className="truncate text-sm font-medium">{displayName}</p>
        <Button
          variant={isSelf ? 'teal_primary' : 'ghost'}
          size="icon"
          onClick={() => handleDownload(fileUrl, displayName)}>
          <Download
            className={cn(
              'size-4',
              isSelf ? 'text-white' : 'text-teal-primary',
            )}
          />
        </Button>
      </div>
    )
  }

  // Render call message
  const renderCallContent = (
    callStatus: 'missed' | 'rejected' | 'completed',
    callDuration?: number,
  ) => {
    const duration = callDuration != null && callDuration > 0 ? callDuration : 0
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    const hoursString = hours !== 0 ? `${hours} giờ` : ''
    const minutesString = minutes !== 0 ? `${minutes} phút` : ''
    const secondsString = seconds !== 0 ? `${seconds} giây` : ''
    const durationString = `${hoursString} ${minutesString} ${secondsString}`

    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl p-3',
          isSelf ? 'bg-teal-primary text-white' : 'text-teal-primary bg-white',
        )}>
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-full border-2',
            isSelf ? 'border-white' : 'border-teal-primary',
          )}>
          <Video className="size-6 shrink-0" fill="white" />
        </div>
        <div>
          <p className="truncate text-sm font-medium">
            {CALL_STATUS_LABELS[callStatus]}
          </p>
          {durationString && (
            <p className="truncate text-sm font-medium">{durationString}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex max-w-[80%] gap-2',
        isLast ? 'mb-2' : 'mb-0.5',
        isSelf && 'self-end',
      )}>
      {/* Avatar */}
      {isLast ? (
        <SafeImage
          className={cn(
            'mt-auto mb-0.75 flex size-8 shrink-0 rounded-full',
            isSelf && 'hidden',
          )}
          src={message.sender.avatar}
          alt={message.sender.fullName}
        />
      ) : (
        <div className={cn('size-8 shrink-0', isSelf && 'hidden')} />
      )}

      {/* Message content */}
      <div
        className={cn(
          'group relative rounded-2xl',
          isSelf
            ? 'bg-teal-primary w-full rounded-r-sm text-white'
            : 'rounded-l-sm border border-gray-300 bg-white',
          isLast && 'rounded-bl-2xl',
          isFirst && 'rounded-tl-2xl',
          isSelf && isLast && 'rounded-br-2xl!',
          isSelf && isFirst && 'rounded-tr-2xl!',
        )}>
        {message.type === 'image' &&
          message.content.file_url &&
          renderImageContent(message.content.file_url)}

        {message.type === 'file' &&
          message.content.file_url &&
          renderFileContent(
            message.content.file_url,
            message.content.file_name,
          )}

        {message.type === 'call' &&
          renderCallContent(
            message.content.call_status ?? 'missed',
            message.content.call_duration ?? 0,
          )}

        {message.content.text && (
          <p className="px-3 py-2 text-base leading-tight">
            {message.content.text}
          </p>
        )}

        <span className="absolute top-1/2 -left-12.5 hidden -translate-y-1/2 rounded-md bg-teal-50 px-2 py-1 text-sm text-black group-hover:block">
          {messageTime}
        </span>
      </div>
    </div>
  )
}
