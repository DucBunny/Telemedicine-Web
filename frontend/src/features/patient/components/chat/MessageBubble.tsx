import React from 'react'
import type { ChatMessage } from '@/features/patient/data/chatMockData'

interface MessageBubbleProps {
  message: ChatMessage
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isSelf = message.sender === 'patient' // Sửa thành so sánh với ID của người dùng hiện tại

  // Self
  if (isSelf) {
    return (
      <div className="flex max-w-[80%] gap-2 self-end">
        <div className="bg-teal-primary rounded-2xl rounded-tr-sm px-4 py-2 text-white">
          <p className="text-base leading-tight">{message.text}</p>
          <span className="mt-0.5 block text-right text-xs opacity-80">
            {message.time}
          </span>
        </div>
      </div>
    )
  }

  // Opposite side
  return (
    <div className="flex max-w-[80%] gap-2">
      {/* Avatar */}
      <div className="mt-auto mb-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
        BS
      </div>

      {/* Message content */}
      <div className="rounded-2xl rounded-tl-sm border border-gray-300 bg-white px-4 py-2">
        <p className="text-base leading-tight">{message.text}</p>
        <span className="mt-0.5 block text-xs opacity-80">{message.time}</span>
      </div>
    </div>
  )
}
