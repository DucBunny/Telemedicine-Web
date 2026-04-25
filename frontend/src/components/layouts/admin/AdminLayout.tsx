import { useState } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'

import {
  AdminHeader,
  AdminSidebar,
  MobileNav,
} from '@/components/layouts/admin'
import { routeToActiveTab } from '@/lib/route-active-tab'

export const AdminLayout = () => {
  const { pathname } = useLocation()
  const activeTab = routeToActiveTab(pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} />

      {/* Main Content */}
      <div className="relative flex h-screen flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          activeTab={activeTab}
        />

        <main
          data-route-scroll-container="true"
          className="flex-1 overflow-y-auto scroll-smooth bg-gray-50 p-4 pb-20 md:p-8 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Menu Overlay */}
        <MobileNav setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    </div>
  )
}
