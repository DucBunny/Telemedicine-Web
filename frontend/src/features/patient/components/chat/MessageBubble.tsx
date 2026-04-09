import React, { useState } from 'react'
import { Download, FileText, FileX } from 'lucide-react'
import { toast } from 'sonner'
import type { ChatMessage } from '@/features/patient/types'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/format-date'

interface MessageBubbleProps {
  message: ChatMessage
  isFirst?: boolean
  isLast?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFirst = false,
  isLast = false,
}) => {
  const currentUser = useAuthStore((state) => state.user)
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
      console.error('Download failed:', error)
      toast.error('Tải file thất bại')
    }
  }

  // Render image message
  const renderImageContent = (fileUrl: string) => (
    <div className="max-w-xs">
      {!imageError ? (
        <img
          src={fileUrl}
          alt={message.content.file_name || 'image'}
          className="cursor-pointer rounded-sm"
          onClick={() => handleImageClick(fileUrl)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-sm border border-gray-300 bg-gray-100 p-3">
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
      <div className="text-teal-primary flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-3 py-1.5">
        <FileText className="size-6 shrink-0" />
        <p className="truncate text-sm font-medium">{displayName}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDownload(fileUrl, displayName)}>
          <Download className="text-teal-primary size-4" />
        </Button>
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
        <img
          className={cn(
            'mt-auto mb-0.75 flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700',
            isSelf && 'hidden',
          )}
          src={message.sender.avatar ?? import.meta.env.VITE_DEFAULT_AVATAR}
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
          isSelf && isLast && 'rounded-br-2xl',
          isSelf && isFirst && 'rounded-tr-2xl',
        )}>
        {message.type === 'image' && message.content.file_url && (
          <div>{renderImageContent(message.content.file_url)}</div>
        )}

        {message.type === 'file' && message.content.file_url && (
          <div>
            {renderFileContent(
              message.content.file_url,
              message.content.file_name,
            )}
          </div>
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
