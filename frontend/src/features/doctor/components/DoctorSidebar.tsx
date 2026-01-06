import { Link } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { NAVIGATION_ITEMS } from '../config'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
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
} from '@/components/ui/sidebar'

interface NavItem {
  id: string
  icon: LucideIcon
  label: string
  href: string
}

interface SidebarProps {
  activeTab: string
}

export const DoctorSidebar = ({ activeTab }: SidebarProps) => {
  const renderNav = (items: Array<NavItem>) => (
    <SidebarMenu>
      {items.map(({ id, icon: Icon, label, href }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton
            asChild
            isActive={activeTab === id}
            tooltip={label}
            className={cn(
              'h-11 gap-3 rounded-lg px-3 font-semibold text-gray-500 hover:bg-gray-50 hover:text-teal-600',
              'data-[active=true]:rounded-r-none data-[active=true]:border-r-4 data-[active=true]:border-teal-600 data-[active=true]:bg-teal-50 data-[active=true]:text-teal-700',
              'group-data-[collapsible=icon]:justify-center',
            )}>
            <Link to={href}>
              <Icon
                className={cn(
                  'size-5! shrink-0 text-gray-400 group-hover/menu-item:text-teal-600',
                  activeTab === id && 'text-teal-600',
                )}
              />
              <span
                className={cn(
                  'truncate',
                  'group-data-[collapsible=icon]:hidden',
                )}>
                {label}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  return (
    <Sidebar
      collapsible="icon"
      className="group/sidebar border-r border-gray-200 bg-white **:data-[sidebar=sidebar]:bg-white"
      style={{
        ['--sidebar-width' as string]: '16rem',
        ['--sidebar-width-icon' as string]: '5rem',
      }}>
      <SidebarHeader className="flex h-18.25 flex-row items-center justify-center border-b border-gray-100">
        <img src="/logo.png" alt="MedCare Logo" className="size-8" />
        <span className="text-xl leading-tight font-bold text-teal-700 group-data-[collapsible=icon]:hidden">
          MedCare
          <span className="text-gray-700">Dr</span>
        </span>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden px-1 py-3 group-data-[collapsible=icon]:gap-1">
        <SidebarGroup className="group-data-[collapsible=icon]:py-0">
          <SidebarGroupLabel className="tracking-wide text-gray-400 uppercase group-data-[collapsible=icon]:hidden">
            Menu chính
          </SidebarGroupLabel>
          {renderNav(NAVIGATION_ITEMS.filter((item) => item.group === 'main'))}
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:py-0">
          <SidebarGroupLabel className="tracking-wide text-gray-400 uppercase group-data-[collapsible=icon]:hidden">
            Hệ thống
          </SidebarGroupLabel>
          {renderNav(
            NAVIGATION_ITEMS.filter((item) => item.group === 'system'),
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-gray-50/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 gap-3 rounded-lg bg-gray-50/50 px-3 font-semibold text-gray-500 group-data-[collapsible=icon]:justify-center hover:bg-red-50 hover:text-red-600">
              <Link to="/">
                <LogOut className="size-5!" />
                <span className="truncate group-data-[collapsible=icon]:hidden">
                  Đăng xuất
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
