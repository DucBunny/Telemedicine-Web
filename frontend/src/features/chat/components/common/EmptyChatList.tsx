import { BriefcaseMedical, CalendarDays, MessageCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyChatListProps {
  onBookAction?: () => void
}

export const EmptyChatList = ({ onBookAction }: EmptyChatListProps) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center px-4 text-center">
      {/* Vòng tròn Background và Icon */}
      <div className="relative mb-8 flex aspect-square w-full max-w-50 items-center justify-center overflow-hidden rounded-full bg-teal-50">
        {/* Các chấm SVG trang trí */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="h-full w-full text-teal-400"
            fill="currentColor"
            viewBox="0 0 100 100">
            <circle cx="20" cy="20" r="2" />
            <circle cx="80" cy="80" r="3" />
            <circle cx="50" cy="10" r="1" />
            <circle cx="10" cy="50" r="2" />
            <circle cx="90" cy="40" r="1.5" />
          </svg>
        </div>

        {/* Icon trung tâm */}
        <BriefcaseMedical className="text-teal-primary/80 size-15" />

        {/* Box Icon Chat nổi lên */}
        <div className="absolute right-7 bottom-7 translate-x-1/4 translate-y-1/4 transform rounded-full bg-white p-3 shadow-lg">
          <MessageCircle className="text-teal-primary/80 size-6" />
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-gray-800">
        Chưa có cuộc trò chuyện nào
      </h2>
      <p
        className={cn(
          'max-w-75 text-sm text-gray-500',
          onBookAction && 'mb-8',
        )}>
        Khi bệnh nhân nhắn tin, cuộc hội thoại sẽ xuất hiện ở đây.
      </p>

      {onBookAction && (
        <Button
          onClick={onBookAction}
          variant="teal_primary"
          className="h-12 w-full max-w-sm rounded-full text-base! font-bold active:scale-[0.98]">
          <CalendarDays className="size-5" strokeWidth="2.5" />
          Đặt lịch ngay
        </Button>
      )}
    </div>
  )
}
