import { Hospital } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface Doctor {
  userId: number
  specialtyId: number
  degree: string
  experienceYears: number
  bio: string
  address: string
  user: {
    id: number
    fullName: string
    email: string
    phone?: string
    avatar?: string
  }
}

interface DoctorCardProps {
  doctor: Doctor
  onBook: (doctorId: number) => void
}

export const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => {
  const initials = doctor.user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
          {doctor.user.avatar ? (
            <img
              alt={`Chân dung ${doctor.user.fullName}`}
              className="h-full w-full object-cover"
              src={doctor.user.avatar}
            />
          ) : (
            <div className="text-teal-primary flex h-full w-full items-center justify-center bg-teal-100 text-xl font-bold dark:bg-teal-900/30 dark:text-teal-400">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base leading-tight font-bold text-slate-900 dark:text-white">
            {doctor.degree}. {doctor.user.fullName}
          </h3>
          <p className="text-teal-primary mt-1 text-xs font-medium dark:text-teal-400">
            {doctor.degree}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-gray-400">
            {doctor.bio}
          </p>

          <div className="mt-2 flex items-center gap-1.5 truncate text-xs text-slate-600 dark:text-gray-400">
            <Hospital className="text-teal-primary size-5.5" />
            <span className="truncate">{doctor.address}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-3 dark:border-gray-800/50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-gray-300">
          <span className="material-symbols-outlined text-teal-primary text-lg">
            work_history
          </span>
          <span>{doctor.experienceYears} năm kinh nghiệm</span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onBook(doctor.userId)
          }}
          size="sm"
          variant="teal_primary"
          className="rounded-xl px-4">
          <span>Đặt lịch</span>
        </Button>
      </div>
    </div>
  )
}
