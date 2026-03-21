import React from 'react'
import { useMatches } from '@tanstack/react-router'
import { MOCK_NOTIFICATIONS } from '@/features/patient/data/mockData'
import { PatientSidebar } from '@/features/patient/components/PatientSidebar'
import { MobileNav } from '@/features/patient/components/MobileNav'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface PatientLayoutProps {
  children: React.ReactNode
  activeTab: string
}

export const PatientLayout = ({ children, activeTab }: PatientLayoutProps) => {
  const matches = useMatches()
  const isHiddenByStaticData = matches.some(
    (match) => match.staticData.hideMobileNav,
  )

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  return (
    <SidebarProvider className="fixed h-dvh overflow-hidden font-sans">
      {/* Sidebar */}
      <PatientSidebar activeTab={activeTab} unreadCount={unreadCount} />

      {/* Main Content */}
      <SidebarInset>
        <main className="scrollbar-hide h-svh w-full flex-1 overflow-y-auto scroll-smooth bg-gray-50 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Navigation */}
        {!isHiddenByStaticData && <MobileNav activeTab={activeTab} />}
      </SidebarInset>
    </SidebarProvider>
  )
}
