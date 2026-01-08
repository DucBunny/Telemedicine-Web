import { useState } from 'react'
import { MOCK_CHATS } from '../data/mockData'
import { SidebarList } from '../components/chat/SidebarList'
import { MainChat } from '../components/chat/MainChat'
import type { ChatMessage } from '../types'

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<ChatMessage>(MOCK_CHATS[0])
  const [isMobileChatDetailOpen, setIsMobileChatDetailOpen] = useState(false)

  const handleSelectChat = (chat: ChatMessage) => {
    setSelectedChat(chat)
    setIsMobileChatDetailOpen(true)
  }

  return (
    <div className="relative flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:h-[calc(100vh-7.5rem)] lg:h-[calc(100vh-8.5rem)]">
      {/* Sidebar List */}
      <SidebarList
        selectedChat={selectedChat}
        handleSelectChat={handleSelectChat}
        isMobileChatDetailOpen={isMobileChatDetailOpen}
      />

      {/* Main Chat Window */}
      <MainChat
        isMobileChatDetailOpen={isMobileChatDetailOpen}
        setIsMobileChatDetailOpen={setIsMobileChatDetailOpen}
        selectedChat={selectedChat}
      />
    </div>
  )
}
