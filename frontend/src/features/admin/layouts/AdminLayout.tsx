import { useState } from 'react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'
import { MobileNav } from '../components/MobileNav'

interface AdminLayoutProps {
  children: React.ReactNode
  activeTab: string
}

export const AdminLayout = ({ children, activeTab }: AdminLayoutProps) => {
  const [, setActiveTab] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <AdminSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <div className="relative flex h-screen flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50 p-4 pb-20 md:p-8 md:pb-8">
          {children}
        </main>

        {/* Mobile Menu Overlay */}
        <MobileNav setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    </div>
  )
}
