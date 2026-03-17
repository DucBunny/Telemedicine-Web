import { Bell } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Patient } from '@/features/patient/types'
import { Button } from '@/components/ui/button'

interface ProfileCardProps {
  profileData: Patient | undefined
  unreadCount?: number
}

export const ProfileCard = ({ profileData, unreadCount }: ProfileCardProps) => {
  return (
    <div className="flex items-center justify-between pt-8 pb-4 md:pt-4">
      <div className="flex items-center gap-4">
        <img
          src={profileData?.user.avatar}
          className="ring-teal-primary/50 size-12 rounded-full border-2 border-white/40 ring-2"
          alt={profileData?.user.fullName}
        />
        <div>
          <h2 className="text-xl leading-tight font-bold tracking-tight">
            {profileData?.user.fullName}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            ID: #{profileData?.userId.toString().padStart(6, '0')}
          </p>
        </div>
      </div>

      <Link to="/patient/notifications" className="relative z-10">
        <Button
          variant="outline"
          size="icon-lg"
          className="hover:text-teal-primary rounded-full border-slate-200 bg-white hover:bg-white/30">
          <Bell size={22} />
          {unreadCount && unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </Link>
    </div>
  )
}
