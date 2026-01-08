import { Search } from 'lucide-react'
import { MOCK_CHATS } from '../../data/mockData'
import { useSidebar } from '../../../../components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarListProps {
  selectedChat: any
  handleSelectChat: (chat: any) => void
  isMobileChatDetailOpen: boolean
}

export const SidebarList = ({
  selectedChat,
  handleSelectChat,
  isMobileChatDetailOpen,
}: SidebarListProps) => {
  const { isMobile, state } = useSidebar()

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex transform flex-col border-gray-200 bg-white transition-transform duration-300 lg:relative lg:w-80 lg:border-r',
        isMobileChatDetailOpen
          ? '-translate-x-full lg:translate-x-0'
          : 'translate-x-0',
      )}>
      {/* Search */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm đoạn chat..."
            className="h-9 bg-white pl-9 text-xs focus-visible:ring-teal-500 focus-visible:ring-offset-0 md:text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="min-h-0 flex-1">
        {MOCK_CHATS.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat)}
            className={cn(
              'flex min-w-0 cursor-pointer items-start border-b border-gray-100 p-4 transition last:border-0 lg:w-80',
              selectedChat.id === chat.id ? 'bg-teal-50' : 'hover:bg-gray-50',
              state === 'collapsed'
                ? 'w-[calc(100vw-8rem)]'
                : 'w-[calc(100vw-19.1rem)]',
              isMobile ? 'w-[calc(100vw-2rem)]' : '',
            )}>
            {/* Avatar */}
            <div className="relative">
              <Avatar>
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.user_name.charAt(0)}</AvatarFallback>
              </Avatar>
              {chat.unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-red-500"></span>
              )}
            </div>

            {/* Name and Last Message */}
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="mb-1 flex items-baseline justify-between">
                <h4
                  className={cn(
                    'truncate text-xs font-semibold md:text-sm',
                    chat.unread > 0 ? 'text-gray-900' : 'text-gray-700',
                  )}>
                  {chat.user_name}
                </h4>
                <span className="shrink-0 text-[10px] text-gray-400 md:text-xs">
                  {chat.time}
                </span>
              </div>
              <p
                className={cn(
                  'shrink-0 truncate text-xs',
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
  )
}
