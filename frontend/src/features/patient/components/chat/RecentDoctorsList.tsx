import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { ChatConversation } from '@/features/patient/types'

interface RecentDoctorsListProps {
  conversations: Array<ChatConversation>
  onClick: (conversationId: string) => void
}

export const RecentDoctorsList = ({
  conversations,
  onClick,
}: RecentDoctorsListProps) => {
  const navigate = useNavigate()

  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto lg:hidden">
      {/* Nút Tạo mới */}
      <div className="ms-4 flex min-w-15 cursor-pointer flex-col items-center gap-1 transition-opacity hover:opacity-80">
        <div className="relative">
          <div
            className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-100"
            onClick={() => navigate({ to: '/patient/appointments' })}>
            <Plus className="size-6 text-gray-400" />
          </div>
        </div>
        <span className="max-w-15 truncate text-center text-xs font-medium">
          Tạo mới
        </span>
      </div>

      {/* Danh sách Bác sĩ */}
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className="flex min-w-15 cursor-pointer flex-col items-center gap-1 transition-opacity last:me-4 hover:opacity-80 md:last:me-20 lg:last:me-4">
          <div className="relative">
            <img
              src={conv.user.avatar ?? import.meta.env.VITE_DEFAULT_AVT}
              alt={conv.user.fullName}
              className="size-14 rounded-full border-2 border-white object-cover"
              onClick={() => onClick(conv.id)}
            />
          </div>
          <span className="max-w-15 truncate text-center text-xs font-medium">
            {conv.user.fullName}
          </span>
        </div>
      ))}
    </div>
  )
}
