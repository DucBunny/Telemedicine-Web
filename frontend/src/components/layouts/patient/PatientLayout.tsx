import { Outlet, useLocation, useMatches } from '@tanstack/react-router'

import {
  useGetUnreadNotificationCount,
  useRealtimeNotifications,
} from '@/features/notifications/hooks/useNotificationQueries'
import { MobileNav, PatientSidebar } from '@/components/layouts/patient'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { routeToActiveTab } from '@/lib/route-active-tab'

export const PatientLayout = () => {
  const { pathname } = useLocation()
  const activeTab = routeToActiveTab(pathname)

  const matches = useMatches()
  const isHiddenByStaticData = matches.some(
    (match) => match.staticData.hideMobileNav,
  )

  // Listen for realtime notifications (sockets)
  useRealtimeNotifications()

  // Lấy số lượng thông báo chưa đọc từ API
  const { data: unreadCount = 0 } = useGetUnreadNotificationCount()

  return (
    <SidebarProvider className="fixed h-dvh overflow-hidden font-sans">
      {/* Sidebar */}
      <PatientSidebar activeTab={activeTab} unreadCount={unreadCount} />

      {/* Main Content */}
      <SidebarInset>
        <main
          data-route-scroll-container="true"
          className="scrollbar-hide h-svh w-full flex-1 overflow-y-auto scroll-smooth bg-gray-50 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        {!isHiddenByStaticData && <MobileNav activeTab={activeTab} />}
      </SidebarInset>
    </SidebarProvider>
  )
}
