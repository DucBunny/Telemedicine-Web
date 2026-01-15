import { Calendar, FileText, Home, MessageSquare, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface MobileNavProps {
  activeTab: string
}

export const MobileNav = ({ activeTab }: MobileNavProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Trang chủ', href: '/patient' },
    {
      id: 'appointments',
      icon: Calendar,
      label: 'Lịch hẹn',
      href: '/patient/appointments',
    },
    { id: 'records', icon: FileText, label: 'Hồ sơ', href: '/patient/records' },
    { id: 'chat', icon: MessageSquare, label: 'Tư vấn', href: '/patient/chat' },
    { id: 'profile', icon: User, label: 'Cá nhân', href: '/patient/profile' },
  ]

  return (
    <div className="pb-safe fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className={`flex w-full flex-col items-center justify-center py-1 transition-colors duration-200 ${
            activeTab === item.id
              ? 'text-teal-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}>
          <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          <span className="mt-1 text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}
