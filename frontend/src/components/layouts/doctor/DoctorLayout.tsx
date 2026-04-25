import { useEffect, useMemo, useState } from 'react'
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
import { DoctorLayoutContext } from '@/components/layouts/doctor/DoctorLayoutContext'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { routeToActiveTab } from '@/lib/route-active-tab'

import './styles.css'

export const DoctorLayout = () => {
  const { pathname } = useLocation()
  const activeTab = routeToActiveTab(pathname)
  const [headerTitle, setHeaderTitle] = useState('')

  const matches = useMatches()
  const isHiddenMobileNav = matches.some(
    (match) => match.staticData.hideMobileNav,
  )
  const isHiddenHeader = matches.some((match) => match.staticData.hideHeader)

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    setHeaderTitle('')
  }, [pathname])

  const layoutContext = useMemo(
    () => ({ setHeaderTitle }),
    [setHeaderTitle],
  )

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
          <DoctorHeader
            activeTab={activeTab}
            unreadCount={unreadCount}
            titleOverride={headerTitle}
          />
        )}

        <main
          data-route-scroll-container="true"
          className="h-svh w-full flex-1 overflow-y-auto scroll-smooth bg-gray-50 md:p-6 lg:p-8">
          <DoctorLayoutContext.Provider value={layoutContext}>
            <Outlet />
          </DoctorLayoutContext.Provider>
        </main>

        {/* Mobile Navigation */}
        {!isHiddenMobileNav && <MobileNav activeTab={activeTab} />}
      </SidebarInset>
    </SidebarProvider>
  )
}
