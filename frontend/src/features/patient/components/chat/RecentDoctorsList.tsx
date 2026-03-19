import { Plus } from 'lucide-react'
import type { DoctorContact } from '@/features/patient/components/chat/ChatList'

interface RecentDoctorsListProps {
  doctors: Array<DoctorContact>
}

export const RecentDoctorsList = ({ doctors }: RecentDoctorsListProps) => (
  <div className="scrollbar-hide flex gap-3 overflow-x-auto lg:hidden">
    {/* Nút Tạo mới */}
    <div className="ms-4 flex min-w-15 cursor-pointer flex-col items-center gap-1 transition-opacity hover:opacity-80">
      <div className="relative">
        <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-100">
          <Plus className="size-6 text-gray-400" />
        </div>
      </div>
      <span className="max-w-15 truncate text-center text-xs font-medium">
        Tạo mới
      </span>
    </div>

    {/* Danh sách Bác sĩ */}
    {doctors.map((doctor) => (
      <div
        key={doctor.id}
        className="flex min-w-15 cursor-pointer flex-col items-center gap-1 transition-opacity last:me-4 hover:opacity-80 md:last:me-20 lg:last:me-4">
        <div className="relative">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="size-14 rounded-full border-2 border-white object-cover"
          />
          {doctor.isOnline && (
            <span className="absolute right-0 bottom-0 block size-3.5 rounded-full bg-green-500 ring-2 ring-white"></span>
          )}
        </div>
        <span className="max-w-15 truncate text-center text-xs font-medium">
          {doctor.name}
        </span>
      </div>
    ))}
  </div>
)
