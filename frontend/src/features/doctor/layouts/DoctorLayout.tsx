import React from 'react'
import { DoctorHeader } from '../components/DoctorHeader'
import { DoctorSidebar } from '../components/DoctorSidebar'
import { MobileNav } from '../components/MobileNav'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import '../styles/styles.css'

interface DoctorLayoutProps {
  children: React.ReactNode
  activeTab: string
}

export const DoctorLayout = ({ children, activeTab }: DoctorLayoutProps) => {
  return (
    <SidebarProvider className="overflow-hidden font-sans">
      {/* Sidebar */}
      <DoctorSidebar activeTab={activeTab} />

      {/* Main Content */}
      <SidebarInset>
        <DoctorHeader activeTab={activeTab} />

        <main className="h-screen w-full flex-1 scroll-smooth bg-gray-50 p-4 pb-20 md:overflow-y-auto md:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav activeTab={activeTab} />
      </SidebarInset>
    </SidebarProvider>
  )
}
