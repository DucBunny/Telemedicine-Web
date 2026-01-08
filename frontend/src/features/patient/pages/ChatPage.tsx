import { MessageSquare } from 'lucide-react'

export const ChatPage = () => {
  return (
    <div className="mt-2 flex h-[calc(100vh-80px)] flex-col bg-white md:mt-0 md:h-full md:rounded-2xl md:border md:border-gray-200 md:shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <h1 className="text-lg font-bold text-gray-900">Chat với bác sĩ</h1>
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-400">
        <MessageSquare size={48} className="mb-4 text-gray-200" />
        <p>Chọn một bác sĩ để bắt đầu cuộc trò chuyện hoặc xem tin nhắn cũ.</p>
        <button className="mt-4 rounded-full bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700">
          Bắt đầu hội thoại mới
        </button>
      </div>
    </div>
  )
}
