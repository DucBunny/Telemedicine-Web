import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { ADMIN_USER } from '../data/mockData'

interface AdminHeaderProps {
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (collapsed: boolean) => void
  activeTab: string
}

export const AdminHeader = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  activeTab,
}: AdminHeaderProps) => {
  return (
    <header className="z-20 flex h-18.25 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center">
        <span className="text-lg font-bold text-gray-900 md:hidden">
          Admin<span className="text-teal-600">Portal</span>
        </span>

        <div className="hidden items-center md:flex">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mr-3 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-teal-600">
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {activeTab === 'dashboard'
              ? 'Tổng quan hệ thống'
              : activeTab === 'users'
                ? 'Quản lý người dùng'
                : activeTab === 'devices'
                  ? 'Quản lý thiết bị IoT'
                  : 'Cấu hình hệ thống'}
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex cursor-pointer items-center rounded-lg p-1.5 transition-colors hover:bg-gray-50">
          <img
            src={ADMIN_USER.avatar}
            alt="Admin"
            className="h-8 w-8 rounded-full border border-gray-200"
          />
          <div className="ml-2 hidden text-left sm:block">
            <p className="text-sm leading-none font-medium text-gray-900">
              {ADMIN_USER.full_name}
            </p>
            <p className="mt-1 text-xs leading-none text-teal-600">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
