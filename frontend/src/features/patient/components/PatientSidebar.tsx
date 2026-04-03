import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Bell } from 'lucide-react'
import type { NavItem } from '@/features/patient/navigation'
import { NAVIGATION_ITEMS } from '@/features/patient/navigation'
import { useGetPatientProfile } from '@/features/patient/hooks/usePatientQueries'
import { cn } from '@/lib/utils'
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
import { Badge } from '@/components/ui/badge'

interface PatientSidebarProps {
  activeTab: string
  unreadCount: number
}

export const PatientSidebar = ({
  activeTab,
  unreadCount,
}: PatientSidebarProps) => {
  const { data: patientProfile } = useGetPatientProfile()
  const { setOpen } = useSidebar()
  useEffect(() => {
    // Hàm kiểm tra kích thước màn hình và tự động đóng sidebar nếu ở kích thước tablet (768px - 1023px)
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width >= 768 && width < 1024) setOpen(false)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [setOpen])

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
        {renderNav(NAVIGATION_ITEMS)}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center rounded-xl py-3 group-data-[collapsible=icon]:justify-center group-data-[state=expanded]:bg-gray-50 group-data-[state=expanded]:px-3">
            <img
              src={
                patientProfile?.user.avatar ?? import.meta.env.VITE_DEFAULT_AVT
              }
              alt={patientProfile?.user.fullName}
              className="h-10 w-10 rounded-full"
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
