import { Hospital } from 'lucide-react'
import type { Doctor } from '@/features/patient/types'
import { Button } from '@/components/ui/button'

interface DoctorCardProps {
  doctor: Doctor
  onBook: (doctorId: number) => void
}

export const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => (
  <div className="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100">
        <img
          src={doctor.user.avatar ?? import.meta.env.VITE_DEFAULT_AVT}
          alt={doctor.user.fullName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-teal-primary truncate text-base leading-tight font-bold">
          {doctor.degree}. {doctor.user.fullName}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 md:text-sm">
          {doctor.bio}
        </p>

        <div className="mt-2 flex items-center gap-1.5 truncate text-xs text-slate-600 md:text-sm">
          <Hospital className="text-teal-primary size-5.5" />
          <span className="truncate">{doctor.address}</span>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 md:text-sm">
        <span className="material-symbols-outlined text-teal-primary">
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
