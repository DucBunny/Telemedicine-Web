import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'

import type { Patient } from '@/features/patients/types'
import type { NavItem } from '@/types/navigation'

import { useGetProfile } from '@/features/profile/hooks/useProfileQueries'
import { SafeImage } from '@/components/common/SafeImage'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { PATIENT_NAVIGATION_ITEMS } from '@/types/navigation'

interface PatientSidebarProps {
  activeTab: string
  unreadCount: number
}

export const PatientSidebar = ({
  activeTab,
  unreadCount,
}: PatientSidebarProps) => {
  const { data: patientProfile } = useGetProfile<Patient>()
  const { setOpen } = useSidebar()
  const isTablet = useMediaQuery('(768px <= width < 1024px)')
  useEffect(() => {
    // Hàm kiểm tra kích thước màn hình và tự động đóng sidebar nếu ở kích thước tablet (768px - 1023px)
    if (isTablet) setOpen(false)
  }, [isTablet, setOpen])

  // Render navigation items with active state and tooltips
  const renderNav = (items: Array<NavItem>) => (
    <SidebarMenu>
      {items.map(({ id, icon: Icon, label, href }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton
            asChild
            isActive={activeTab === id}
            tooltip={label}
            className={cn(
              'hover:text-teal-primary h-12 gap-3 rounded-lg px-4 py-3.5 text-base font-medium text-gray-500 hover:bg-gray-50',
              'data-[active=true]:text-teal-primary data-[active=true]:bg-teal-100/40',
              'group-data-[collapsible=icon]:relative group-data-[collapsible=icon]:justify-center',
            )}>
            <Link to={href}>
              <Icon
                className={cn(
                  'group-hover/menu-item:text-teal-primary size-5! shrink-0 text-gray-400',
                  activeTab === id && 'text-teal-primary',
                )}
                strokeWidth={activeTab === id ? 3 : 2}
              />
              <span
                className={cn(
                  'truncate',
                  'group-data-[collapsible=icon]:hidden',
                )}>
                {label}
              </span>
              {Icon === Bell && unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className={cn(
                    'rounded-full bg-red-600',
                    'group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:right-1 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:text-[10px]!',
                  )}>
                  {unreadCount}
                </Badge>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  return (
    <Sidebar
      collapsible="icon"
      className="group/sidebar border-r border-gray-200 bg-white **:data-[sidebar=sidebar]:bg-white">
      <SidebarHeader className="flex h-18 flex-row items-center justify-center border-b border-gray-100">
        <img src="/logo.png" alt="MedCare Logo" className="size-8" />
        <span className="text-xl leading-tight font-bold text-teal-700 group-data-[collapsible=icon]:hidden">
          MedCare
          <span className="text-gray-700">App</span>
        </span>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden p-4">
        {renderNav(PATIENT_NAVIGATION_ITEMS)}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center rounded-xl py-3 group-data-[collapsible=icon]:justify-center group-data-[state=expanded]:bg-gray-50 group-data-[state=expanded]:px-3">
            <SafeImage
              src={patientProfile?.user.avatar}
              alt={patientProfile?.user.fullName}
              className="size-10 rounded-full"
            />
            <div className="ml-3 overflow-hidden group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-gray-900">
                {patientProfile?.user.fullName}
              </p>
              <p className="text-xs font-medium text-gray-500">
                ID: {patientProfile?.userId}
              </p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="sm:hidden lg:flex" />
    </Sidebar>
  )
}
