import React, { createContext, useContext, useMemo, useState } from 'react'
import { MOCK_NOTIFICATIONS } from '@/features/patient/data/mockData'
import { PatientSidebar } from '@/features/patient/components/PatientSidebar'
import { MobileNav } from '@/features/patient/components/MobileNav'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface PatientLayoutProps {
  children: React.ReactNode
  activeTab: string
}

type MobileNavContextProps = {
  isShowMobileNav: boolean
  setShowMobileNav: (isShowMobileNav: boolean) => void
}

export const MobileNavContext = createContext<MobileNavContextProps>({
  isShowMobileNav: true,
  setShowMobileNav: () => {},
})

export const useMobileNav = () => useContext(MobileNavContext)

export const PatientLayout = ({ children, activeTab }: PatientLayoutProps) => {
  const [isShowMobileNav, setShowMobileNav] = useState(true)
  const contextValue = useMemo<MobileNavContextProps>(
    () => ({
      isShowMobileNav,
      setShowMobileNav,
    }),
    [isShowMobileNav],
  )

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  return (
    <MobileNavContext.Provider value={contextValue}>
      <SidebarProvider className="fixed h-dvh overflow-hidden font-sans">
        {/* Sidebar */}
        <PatientSidebar activeTab={activeTab} unreadCount={unreadCount} />

        {/* Main Content */}
        <SidebarInset>
          <main className="scrollbar-hide h-svh w-full flex-1 overflow-y-auto scroll-smooth bg-gray-50 md:p-6 lg:p-8">
            {children}
          </main>

          {/* Mobile Navigation */}
          {isShowMobileNav && <MobileNav activeTab={activeTab} />}
        </SidebarInset>
      </SidebarProvider>
    </MobileNavContext.Provider>
  )
}
