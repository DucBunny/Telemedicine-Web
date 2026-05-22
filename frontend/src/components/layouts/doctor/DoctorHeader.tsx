import { Link, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Bell } from 'lucide-react'

import type { Doctor } from '@/features/doctors/types'

import { useGetProfile } from '@/features/profile/hooks/useProfileQueries'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface DoctorHeaderProps {
  unreadNotificationCount: number
  pendingAlertCount: number
  title: string
}

export const DoctorHeader = ({
  unreadNotificationCount,
  pendingAlertCount,
  title,
}: DoctorHeaderProps) => {
  const { data: doctorProfile } = useGetProfile<Doctor>()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex h-15 min-w-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:h-18 md:px-6">
      <div className="flex min-w-0 items-center">
        {/* Desktop Toggle */}
        <div className="flex min-w-0 items-center">
          <SidebarTrigger className="hover:text-teal-primary mr-3 hidden shrink-0 text-gray-500 lg:block" />
          <h2 className="truncate text-xl font-bold text-gray-800">{title}</h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <Button
          variant="ghost"
          size="icon-lg"
          className="relative size-12 rounded-lg text-gray-500 hover:bg-gray-100 sm:me-0"
          onClick={() => navigate({ to: '/doctor/alerts' })}>
          <AlertTriangle className="size-5" />
          {pendingAlertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-0.5 right-0.5 rounded-full bg-red-600 px-1 text-[10px]!">
              {pendingAlertCount}
            </Badge>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon-lg"
          className="relative me-2 size-12 rounded-lg text-gray-500 hover:bg-gray-100 sm:me-0"
          onClick={() => navigate({ to: '/doctor/notifications' })}>
          <Bell className="size-5" />
          {unreadNotificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-0.5 right-0.5 rounded-full bg-red-600 px-1 text-[10px]!">
              {unreadNotificationCount}
            </Badge>
          )}
        </Button>

        <div className="mx-2 hidden h-8 w-px bg-gray-200 sm:block"></div>

        <Link to="/doctor/settings">
          <div className="flex items-center rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Avatar className="size-8 border border-gray-200">
              <AvatarImage src={doctorProfile?.user.avatar} />
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <div className="ml-2 hidden text-left sm:block">
              <p className="text-sm leading-none font-medium text-gray-900">
                BS. {doctorProfile?.user ? doctorProfile.user.fullName : '—'}
              </p>
              <p className="text-teal-primary mt-1 text-xs leading-none">
                Khoa{' '}
                {doctorProfile?.specialty ? doctorProfile.specialty.name : '—'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  )
}
