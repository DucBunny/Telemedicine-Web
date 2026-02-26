import { Link } from '@tanstack/react-router'
import { NAVIGATION_ITEMS } from '../config'
import { useGetPatientProfile } from '../hooks/usePatientQueries'
import type { NavItem } from '../config'
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
} from '@/components/ui/sidebar'

interface PatientSidebarProps {
  activeTab: string
  unreadCount: number
}

export const PatientSidebar = ({
  activeTab,
  unreadCount,
}: PatientSidebarProps) => {
  const { data } = useGetPatientProfile()
  const renderNav = (items: Array<NavItem>) => (
    <SidebarMenu>
      {items.map(({ id, icon: Icon, label, href }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton
            asChild
            isActive={activeTab === id}
            tooltip={label}
            className={cn(
              'h-12 gap-3 rounded-lg px-4 py-3.5 font-medium text-gray-500 hover:bg-gray-50 hover:text-teal-600',
              'data-[active=true]:bg-teal-50 data-[active=true]:text-teal-700 data-[active=true]:shadow-sm',
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
              src={data?.user.avatar}
              alt="Avatar"
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-3 overflow-hidden group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-gray-900">
                {data?.user.fullName}
              </p>
              <p className="text-xs text-gray-500">Mã: BN-{data?.userId}</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
