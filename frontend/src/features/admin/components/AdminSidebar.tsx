import {
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Smartphone,
  Users,
} from 'lucide-react'
import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'

interface AdminSidebarProps {
  isSidebarCollapsed: boolean
  setActiveTab: (tab: string) => void
  activeTab: string
}

interface NavItemProps {
  id: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
}

export const AdminSidebar = ({
  isSidebarCollapsed,
  setActiveTab,
  activeTab,
}: AdminSidebarProps) => {
  const logoutMutation = useLogoutMutation()
  const NavItem = ({ id, icon: Icon, label }: NavItemProps) => (
    <button
      onClick={() => {
        setActiveTab(id)
        window.location.href = `/admin/${id === 'dashboard' ? '' : id}`
      }}
      className={`group mb-1 flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
        activeTab === id
          ? 'rounded-r-none border-r-4 border-teal-600 bg-teal-50 text-teal-700'
          : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'
      } ${isSidebarCollapsed ? 'justify-center px-2' : ''} `}
      title={isSidebarCollapsed ? label : ''}>
      <Icon
        className={`h-5 w-5 shrink-0 ${
          activeTab === id
            ? 'text-teal-600'
            : 'text-gray-400 group-hover:text-teal-600'
        } ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`}
      />
      {!isSidebarCollapsed && (
        <span className="whitespace-nowrap opacity-100 transition-opacity duration-300">
          {label}
        </span>
      )}
    </button>
  )

  return (
    <aside
      className={`z-30 hidden flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out md:flex ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
      <div
        className={`flex h-18.25 items-center border-b border-gray-100 p-4 ${
          isSidebarCollapsed ? 'justify-center' : 'justify-center'
        }`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-800">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!isSidebarCollapsed && (
          <span className="ml-2 overflow-hidden text-xl font-bold tracking-tight whitespace-nowrap text-gray-900">
            Admin<span className="text-teal-600">Portal</span>
          </span>
        )}
      </div>

      <div className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {!isSidebarCollapsed && (
          <p className="mb-2 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Quản trị
          </p>
        )}
        <NavItem id="dashboard" icon={LayoutDashboard} label="Tổng quan" />
        <NavItem id="users" icon={Users} label="Người dùng (Users)" />
        <NavItem id="devices" icon={Smartphone} label="Thiết bị IoT" />

        {!isSidebarCollapsed && (
          <p className="mt-6 mb-2 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Hệ thống
          </p>
        )}
        <NavItem id="settings" icon={Settings} label="Cấu hình" />
      </div>

      <div className="border-t border-gray-100 bg-gray-50/50 p-4">
        <button
          onClick={() => logoutMutation.mutate()}
          className={`flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
          title={isSidebarCollapsed ? 'Đăng xuất' : ''}>
          <LogOut
            className={`h-5 w-5 shrink-0 ${isSidebarCollapsed ? '' : 'mr-3'}`}
          />
          {!isSidebarCollapsed && (
            <span className="whitespace-nowrap">Đăng xuất</span>
          )}
        </button>
      </div>
    </aside>
  )
}
