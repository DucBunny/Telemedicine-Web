import React, { useState } from 'react'
import {
  CheckCircle,
  ChevronLeft,
  FileText,
  Paperclip,
  Phone,
  Search,
  Send,
} from 'lucide-react'
import { MOCK_CHATS } from '../../data/mockData'
import type { ChatMessage } from '../../types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export const ChatView: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatMessage>(MOCK_CHATS[0])
  const [isMobileChatDetailOpen, setIsMobileChatDetailOpen] = useState(false)

  const handleSelectChat = (chat: ChatMessage) => {
    setSelectedChat(chat)
    setIsMobileChatDetailOpen(true)
  }

  return (
    <div className="relative flex h-[calc(100vh-140px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Sidebar List */}
      <div
        className={cn(
          'absolute inset-0 z-10 flex w-full transform flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:relative md:w-80',
          isMobileChatDetailOpen
            ? '-translate-x-full md:translate-x-0'
            : 'translate-x-0',
        )}>
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm đoạn chat..."
              className="h-9 border-gray-200 bg-white pr-3 pl-9 text-xs focus-visible:ring-teal-500 md:text-sm"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {MOCK_CHATS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={cn(
                'flex cursor-pointer items-start border-b border-gray-50 p-4 transition last:border-0',
                selectedChat.id === chat.id ? 'bg-teal-50' : 'hover:bg-gray-50',
              )}>
              <div className="relative">
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-red-500"></span>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="mb-1 flex items-baseline justify-between">
                  <h4
                    className={cn(
                      'truncate text-xs font-semibold md:text-sm',
                      chat.unread > 0 ? 'text-gray-900' : 'text-gray-700',
                    )}>
                    {chat.user_name}
                  </h4>
                  <span className="text-[10px] text-gray-400 md:text-xs">
                    {chat.time}
                  </span>
                </div>
                <p
                  className={cn(
                    'truncate text-xs',
                    chat.unread > 0
                      ? 'font-medium text-teal-700'
                      : 'text-gray-500',
                  )}>
                  {chat.last_message}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Window */}
      <div
        className={cn(
          'absolute inset-0 z-20 flex flex-1 transform flex-col bg-white transition-transform duration-300 md:relative',
          isMobileChatDetailOpen
            ? 'translate-x-0'
            : 'translate-x-full md:translate-x-0',
        )}>
        {/* Header */}
        <div className="z-10 flex items-center justify-between border-b border-gray-200 bg-white p-3 shadow-sm md:p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileChatDetailOpen(false)}
              className="mr-2 text-gray-500 md:hidden">
              <ChevronLeft size={24} />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src={selectedChat.avatar} />
              <AvatarFallback>
                {selectedChat.user_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h3 className="text-xs font-bold text-gray-900 md:text-sm">
                {selectedChat.user_name}
              </h3>
              <div className="flex items-center text-[10px] text-green-500 md:text-xs">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Online
              </div>
            </div>
          </div>
          <div className="flex space-x-1 text-gray-400 md:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100">
              <Phone size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100">
              <FileText size={18} />
            </Button>
          </div>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-1 bg-gray-50/50 p-4">
          <div className="space-y-4">
            <div className="my-4 flex justify-center">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-400 md:text-xs">
                Hôm nay
              </span>
            </div>

            {/* Incoming Message */}
            <div className="flex justify-start">
              <Avatar className="mt-1 mr-2 h-8 w-8">
                <AvatarImage src={selectedChat.avatar} />
              </Avatar>
              <div className="max-w-[75%] md:max-w-[70%]">
                <div className="rounded-2xl rounded-tl-none border border-gray-200 bg-white p-3 text-xs text-gray-800 shadow-sm md:text-sm">
                  Chào bác sĩ, thuốc này uống sau ăn được không ạ?
                </div>
                <span className="mt-1 ml-1 block text-[10px] text-gray-400">
                  08:45
                </span>
              </div>
            </div>

            {/* Outgoing Message */}
            <div className="flex justify-end">
              <div className="max-w-[75%] text-right md:max-w-[70%]">
                <div className="rounded-2xl rounded-tr-none bg-teal-600 p-3 text-left text-xs text-white shadow-sm md:text-sm">
                  Chào bạn, đúng rồi nhé. Bạn nên uống sau khi ăn khoảng 30 phút
                  để tránh hại dạ dày.
                </div>
                <div className="mt-1 flex items-center justify-end space-x-1">
                  <span className="text-[10px] text-gray-400">08:48</span>
                  <CheckCircle size={10} className="text-teal-600" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-3 md:p-4">
          <div className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-teal-600">
              <Paperclip size={20} />
            </Button>
            <Input
              className="flex-1 border-none bg-transparent text-xs text-gray-800 placeholder-gray-400 shadow-none focus-visible:ring-0 md:text-sm"
              placeholder="Nhập tin nhắn..."
            />
            <Button
              size="icon"
              className="bg-teal-600 text-white shadow-sm hover:bg-teal-700">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
