import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, LogOut } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'

import type { NavItem } from '@/types/navigation'

import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { DOCTOR_NAVIGATION_ITEMS } from '@/types/navigation'

interface SidebarProps {
  activeTab: string
  unreadCount: number
}

export const DoctorSidebar = ({ activeTab, unreadCount }: SidebarProps) => {
  const { mutate: logout } = useLogoutMutation()
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
              'data-[active=true]:border-teal-primary data-[active=true]:text-teal-primary data-[active=true]:rounded-r-none data-[active=true]:border-r-4 data-[active=true]:bg-teal-100/40',
              'group-data-[collapsible=icon]:relative group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-r-lg! group-data-[collapsible=icon]:border-none',
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
          <span className="text-gray-700">Dr</span>
        </span>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden px-1 py-2 group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-2">
        <SidebarGroup className="group-data-[collapsible=icon]:py-0">
          <SidebarGroupLabel className="tracking-wide text-gray-400 uppercase group-data-[collapsible=icon]:hidden">
            Menu chính
          </SidebarGroupLabel>
          {renderNav(
            DOCTOR_NAVIGATION_ITEMS.filter((item) => item.group === 'main'),
          )}
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:py-0">
          <SidebarGroupLabel className="tracking-wide text-gray-400 uppercase group-data-[collapsible=icon]:hidden">
            Hệ thống
          </SidebarGroupLabel>
          {renderNav(
            DOCTOR_NAVIGATION_ITEMS.filter((item) => item.group === 'system'),
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-gray-50/50 p-3 group-data-[collapsible=icon]:px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Đăng xuất"
              onClick={() => logout()}
              className="h-12 gap-3 rounded-lg bg-transparent px-4 py-3.5 font-medium text-gray-500 group-data-[collapsible=icon]:justify-center hover:bg-red-50 hover:text-red-600">
              <div>
                <LogOut className="size-5!" />
                <span className="truncate group-data-[collapsible=icon]:hidden">
                  Đăng xuất
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
