import { Outlet, useLocation, useMatches } from '@tanstack/react-router'
import { useMediaQuery } from 'usehooks-ts'

import {
  useGetUnreadNotificationCount,
  useRealtimeNotifications,
} from '@/features/notifications/hooks/useNotificationQueries'
import {
  DoctorHeader,
  DoctorSidebar,
  MobileNav,
} from '@/components/layouts/doctor'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { routeToActiveTab } from '@/lib/route-active-tab'
import { DOCTOR_NAVIGATION_ITEMS } from '@/types/navigation'

import './styles.css'

export const DoctorLayout = () => {
  const { pathname } = useLocation()
  const activeTab = routeToActiveTab(pathname)

  const matches = useMatches()

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Lấy thông tin từ staticData của route hiện tại
  // reverse để ưu tiên lấy thông tin từ route con trước, sau đó mới đến route cha
  const {
    hideMobileNav: isHiddenMobileNav,
    hideHeader: isHiddenHeader,
    title,
  } = matches
    .reverse()
    .find(
      (match) =>
        match.staticData.title ||
        match.staticData.hideMobileNav ||
        match.staticData.hideHeader,
    )?.staticData || {}

  const pageTitle =
    title ||
    DOCTOR_NAVIGATION_ITEMS.find((item) => item.id === activeTab)?.label ||
    ''

  // Listen for realtime notifications (sockets)
  useRealtimeNotifications()

  // Lấy số lượng thông báo chưa đọc từ API
  const { data: unreadCount = 0 } = useGetUnreadNotificationCount()

  return (
    <SidebarProvider className="fixed h-dvh overflow-x-auto font-sans">
      {/* Sidebar */}
      <DoctorSidebar activeTab={activeTab} unreadCount={unreadCount} />

      {/* Main Content */}
      <SidebarInset>
        {(isDesktop || !isHiddenHeader) && (
          <DoctorHeader unreadCount={unreadCount} title={pageTitle} />
        )}

        <main
          data-route-scroll-container="true"
          className="h-svh w-full flex-1 overflow-y-auto scroll-smooth bg-gray-50 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        {!isHiddenMobileNav && <MobileNav activeTab={activeTab} />}
      </SidebarInset>
    </SidebarProvider>
  )
}
