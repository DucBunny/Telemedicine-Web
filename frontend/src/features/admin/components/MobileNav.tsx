import { LayoutDashboard, Settings, Smartphone, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface MobileNavProps {
  setActiveTab: (tab: string) => void
  activeTab: string
}

export const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'users', icon: Users, label: 'Người dùng' },
    { id: 'devices', icon: Smartphone, label: 'Thiết bị' },
    { id: 'settings', icon: Settings, label: 'Cấu hình' },
  ]

  return (
    <div className="pb-safe fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const href = `/admin/${item.id === 'dashboard' ? '' : item.id}`
        return (
          <Link
            key={item.id}
            to={href}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full flex-col items-center justify-center py-1 transition-colors duration-200 ${
              activeTab === item.id
                ? 'text-teal-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}>
            <Icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="mt-1 text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
