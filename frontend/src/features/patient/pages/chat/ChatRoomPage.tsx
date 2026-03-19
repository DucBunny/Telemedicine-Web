import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ChatMessage } from '@/features/patient/data/chatMockData'
import { useHideMobileNav } from '@/features/patient/hooks/useHideMobileNav'
import {
  ChatHeader,
  ChatInput,
  MessageBubble,
  TypingIndicator,
} from '@/features/patient/components/chat/'
import {
  MOCK_CHAT_MESSAGES,
  MOCK_DOCTOR,
} from '@/features/patient/data/chatMockData'

export const ChatRoomPage = () => {
  useHideMobileNav()

  const navigate = useNavigate()
  const [messages, setMessages] =
    useState<Array<ChatMessage>>(MOCK_CHAT_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null) // Dùng để cuộn xuống cuối

  const handleBack = () => {
    navigate({ to: '/patient/chat' })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'patient',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages([...messages, newMessage])
    setInputValue('')
  }

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <div className="z-10 shrink-0 bg-white">
        <ChatHeader doctor={MOCK_DOCTOR} onBack={handleBack} />
      </div>

      <div className="scrollbar-hide flex flex-1 flex-col gap-2 overflow-y-auto p-4 pb-0 md:ml-20">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} className="h-0.5" />
        {/* Thẻ ẩn để làm mốc cuộn */}
      </div>

      <div className="z-10 shrink-0 bg-white">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  )
}
