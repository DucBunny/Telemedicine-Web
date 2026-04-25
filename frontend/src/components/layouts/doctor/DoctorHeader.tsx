import { Link, useNavigate } from '@tanstack/react-router'
import { Bell, Search } from 'lucide-react'

import type { Doctor } from '@/features/doctors/types'

import { useGetProfile } from '@/features/profile/hooks/useProfileQueries'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DOCTOR_NAVIGATION_ITEMS } from '@/types/navigation'

interface DoctorHeaderProps {
  activeTab: string
  unreadCount: number
  titleOverride?: string
}

export const DoctorHeader = ({
  activeTab,
  unreadCount,
  titleOverride,
}: DoctorHeaderProps) => {
  const { data: doctorProfile } = useGetProfile<Doctor>()
  const navigate = useNavigate()
  const fallbackTitle = DOCTOR_NAVIGATION_ITEMS.find(
    (item) => item.id === activeTab,
  )?.label
  const headerTitle = titleOverride?.trim() || fallbackTitle

  return (
    <header className="sticky top-0 z-20 flex h-15 min-w-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:h-18 md:px-6">
      <div className="flex min-w-0 items-center">
        {/* Desktop Toggle */}
        <div className="flex min-w-0 items-center">
          <SidebarTrigger className="hover:text-teal-primary mr-3 hidden shrink-0 text-gray-500 lg:block" />
          <h2 className="truncate text-xl font-bold text-gray-800">{headerTitle}</h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <div className="relative me-2 hidden lg:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="w-48 border-gray-200 bg-gray-50 pr-4 pl-9 focus-visible:ring-teal-500 focus-visible:ring-offset-0 md:w-64"
          />
        </div>

        <Button
          variant="ghost"
          size="icon-lg"
          className="relative me-2 size-12 rounded-lg text-gray-500 hover:bg-gray-100 sm:me-0"
          onClick={() => navigate({ to: '/doctor/notifications' })}>
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-0.5 right-0.5 rounded-full bg-red-600 px-1 text-[10px]!">
              {unreadCount}
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
                BS. {doctorProfile?.user.fullName}
              </p>
              <p className="text-teal-primary mt-1 text-xs leading-none">
                Khoa {doctorProfile?.specialty.name}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  )
}
