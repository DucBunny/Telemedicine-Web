import { Bell } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Patient } from '../../types'
import { Button } from '@/components/ui/button'

interface ProfileCardProps {
  profileData: Patient | undefined
  unreadCount?: number
}

export const ProfileCard = ({ profileData, unreadCount }: ProfileCardProps) => {
  return (
    <div className="-mx-4 overflow-hidden rounded-b-4xl bg-linear-to-br from-teal-600 to-teal-500 p-6 text-white shadow-lg shadow-teal-100 md:mx-0 md:rounded-3xl">
      {/* Name And Notifications */}
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <img
            src={profileData?.user.avatar}
            className="mr-3 h-12 w-12 rounded-full border-2 border-white/40 md:hidden"
            alt="Avatar Mobile"
          />
          <div>
            <p className="mb-0.5 text-sm text-teal-100">Xin chào,</p>
            <h1 className="text-2xl font-bold">{profileData?.user.fullName}</h1>
          </div>
        </div>

        <Link to="/patient/notifications" className="relative z-10">
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full border border-white/10 bg-white/20 backdrop-blur-sm transition hover:bg-white/30 hover:text-white">
            <Bell size={22} />
            {unreadCount && unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 size-2.5 rounded-full border-2 border-teal-600 bg-red-500"></span>
            )}
          </Button>
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-8 flex gap-3">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-md">
          <p className="mb-1 text-xs tracking-wider text-teal-100 uppercase opacity-80">
            Chiều cao
          </p>
          <p className="text-xl font-bold">
            {profileData?.height}{' '}
            <span className="text-xs font-normal opacity-80">cm</span>
          </p>
        </div>
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-md">
          <p className="mb-1 text-xs tracking-wider text-teal-100 uppercase opacity-80">
            Cân nặng
          </p>
          <p className="text-xl font-bold">
            {profileData?.weight}{' '}
            <span className="text-xs font-normal opacity-80">kg</span>
          </p>
        </div>
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-md">
          <p className="mb-1 text-xs tracking-wider text-teal-100 uppercase opacity-80">
            Nhóm máu
          </p>
          <p className="text-xl font-bold">{profileData?.bloodType}</p>
        </div>
      </div>
    </div>
  )
}
