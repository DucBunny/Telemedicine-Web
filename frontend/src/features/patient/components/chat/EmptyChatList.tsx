import { BriefcaseMedical, CalendarDays, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyChatListProps {
  onBookAction: () => void
}

export const EmptyChatList = ({ onBookAction }: EmptyChatListProps) => {
  return (
    <div className="mx-auto flex h-full w-full flex-1 flex-col items-center justify-center px-4 text-center">
      {/* Vòng tròn Background và Icon */}
      <div className="relative mb-8 flex aspect-square w-full max-w-70 items-center justify-center overflow-hidden rounded-full bg-teal-50">
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
        <BriefcaseMedical className="text-teal-primary/80 size-20" />

        {/* Box Icon Chat nổi lên */}
        <div className="absolute right-10 bottom-10 translate-x-1/4 translate-y-1/4 transform rounded-full bg-white p-3 shadow-lg">
          <MessageCircle className="text-teal-primary/80 size-8" />
        </div>
      </div>

      <h2 className="mb-3 text-xl font-bold">
        Bạn chưa có cuộc trò chuyện nào
      </h2>
      <p className="mb-8 max-w-70 leading-relaxed font-medium text-gray-600">
        Hãy kết nối với bác sĩ để bắt đầu nhận tư vấn trực tuyến.
      </p>

      <Button
        onClick={onBookAction}
        variant="teal_primary"
        className="h-12 w-full max-w-sm rounded-full text-base! font-bold active:scale-[0.98]">
        <CalendarDays className="size-5" strokeWidth="2.5" />
        Đặt lịch ngay
      </Button>
    </div>
  )
}
