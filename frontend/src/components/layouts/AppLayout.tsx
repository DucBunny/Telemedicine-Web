import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { AppHeader } from './AppHeader'
import type { SidebarMenuItem } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  menuItems: Array<SidebarMenuItem>
  userInfo?: {
    name: string
    role: string
    avatarUrl?: string
    avatarFallback: string
  }
  showSearch?: boolean
  searchPlaceholder?: string
  onLogout?: () => void
}

export const AppLayout = ({
  children,
  menuItems,
  userInfo,
  showSearch = true,
  searchPlaceholder,
  onLogout,
}: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 md:block">
        <Sidebar className="h-full" menuItems={menuItems} onLogout={onLogout} />
      </aside>

      {/* Mobile Sidebar (Overlay/Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="animate-in slide-in-from-left relative flex h-full w-64 flex-col bg-white shadow-2xl duration-300">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <X size={20} />
            </button>

            <Sidebar
              menuItems={menuItems}
              onClose={() => setIsMobileMenuOpen(false)}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          onMenuClick={() => setIsMobileMenuOpen(true)}
          userInfo={userInfo}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
        />

        {/* Page Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-slate-50/50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
