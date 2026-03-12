import React from 'react'
import { MOCK_NOTIFICATIONS } from '../data/mockData'
import { PatientSidebar } from '../components/PatientSidebar'
import { MobileNav } from '../components/MobileNav'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface DoctorLayoutProps {
  children: React.ReactNode
  activeTab: string
}

export const PatientLayout = ({ children, activeTab }: DoctorLayoutProps) => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  return (
    <SidebarProvider className="fixed h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <PatientSidebar activeTab={activeTab} unreadCount={unreadCount} />

      {/* Main Content */}
      <SidebarInset>
        <main className="scrollbar-hide h-screen w-full flex-1 overflow-y-auto scroll-smooth bg-gray-50 px-4 pb-20 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav activeTab={activeTab} />
      </SidebarInset>
    </SidebarProvider>
  )
}
