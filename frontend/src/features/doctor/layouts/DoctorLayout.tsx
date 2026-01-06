import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { MobileNav } from '../components/MobileNav'

interface DoctorLayoutProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const DoctorLayout = ({
  children,
  activeTab,
  setActiveTab,
}: DoctorLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-xs text-gray-900 md:text-sm">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="relative flex h-screen flex-1 flex-col overflow-hidden transition-all duration-300">
        {/* Header */}
        <Header
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50 p-4 pb-20 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )
}
