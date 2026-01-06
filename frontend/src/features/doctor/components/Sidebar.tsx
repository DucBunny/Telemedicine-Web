import {
  Calendar,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavItem {
  id: string
  icon: LucideIcon
  label: string
}

interface SidebarProps {
  activeTab: string
  setActiveTab: (id: string) => void
  isCollapsed: boolean
}

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
}: SidebarProps) => {
  const NavItem = ({ id, icon: Icon, label }: NavItem) => (
    <Button
      key={id}
      variant="ghost"
      onClick={() => setActiveTab(id)}
      className={cn(
        'group mb-1 h-11 w-full justify-start rounded-lg duration-200',
        activeTab === id
          ? 'rounded-r-none border-r-4 border-teal-600 bg-teal-50 text-teal-700 hover:bg-teal-50 hover:text-teal-700'
          : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600',
        isCollapsed ? 'justify-center px-2' : '',
      )}
      title={isCollapsed ? label : ''}>
      <Icon
        className={cn(
          'size-5 shrink-0',
          activeTab === id
            ? 'text-teal-600'
            : 'text-gray-400 group-hover:text-teal-600',
          !isCollapsed && 'mr-3',
        )}
      />
      {!isCollapsed && (
        <span className="whitespace-nowrap opacity-100 transition-opacity duration-300">
          {label}
        </span>
      )}
    </Button>
  )

  return (
    <aside
      className={`z-30 hidden flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out md:flex ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Logo */}
      <div className="flex h-18.25 items-center justify-center border-b border-gray-100 p-4">
        <img src="/logo.png" alt="MedCare Logo" className="h-8 w-8" />

        {!isCollapsed && (
          <span className="ml-2 overflow-hidden text-xl font-bold tracking-tight whitespace-nowrap text-teal-700 transition-all duration-300">
            MedCare
            <span className="text-gray-700">Dr</span>
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <div className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {!isCollapsed && (
          <p className="mb-2 px-4 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-400 uppercase">
            Menu chính
          </p>
        )}
        <NavItem id="dashboard" icon={LayoutDashboard} label="Tổng quan" />
        <NavItem id="appointments" icon={Calendar} label="Lịch hẹn" />
        <NavItem id="patients" icon={Users} label="Quản lý bệnh nhân" />
        <NavItem id="chat" icon={MessageSquare} label="Tư vấn trực tuyến" />

        <div className={isCollapsed ? '' : 'mt-6'}>
          {!isCollapsed && (
            <p className="mb-2 px-4 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-400 uppercase">
              Hệ thống
            </p>
          )}
          <NavItem id="settings" icon={Settings} label="Cài đặt" />
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 bg-gray-50/50 p-3">
        <Button variant="ghost" size="lg" className="w-full hover:bg-red-50">
          <Link
            to="/"
            className={cn(
              'flex w-full justify-start rounded-lg text-gray-500 hover:text-red-600',
              isCollapsed ? 'justify-center' : '',
            )}>
            <LogOut className={cn('size-5 shrink-0', !isCollapsed && 'mr-3')} />
            {!isCollapsed && (
              <span className="whitespace-nowrap">Đăng xuất</span>
            )}
          </Link>
        </Button>
      </div>
    </aside>
  )
}
