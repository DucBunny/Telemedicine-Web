import {
  CheckCircle,
  ChevronLeft,
  FileText,
  Paperclip,
  Phone,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'

interface MainChatProps {
  isMobileChatDetailOpen: boolean
  setIsMobileChatDetailOpen: (open: boolean) => void
  selectedChat: any
}

export const MainChat = ({
  isMobileChatDetailOpen,
  setIsMobileChatDetailOpen,
  selectedChat,
}: MainChatProps) => {
  return (
    <div
      className={cn(
        'absolute inset-0 z-20 flex flex-1 transform flex-col bg-white transition-transform duration-300 lg:relative',
        isMobileChatDetailOpen
          ? 'translate-x-0'
          : 'translate-x-full lg:translate-x-0',
      )}>
      {/* Header */}
      <div className="z-10 flex items-center justify-between border-b border-gray-200 bg-white p-3 lg:p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileChatDetailOpen(false)}
            className="mr-2 text-gray-500 lg:hidden">
            <ChevronLeft size={24} />
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src={selectedChat.avatar} />
            <AvatarFallback>{selectedChat.user_name.charAt(0)}</AvatarFallback>
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
          <Button size="icon" variant="teal_primary">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
