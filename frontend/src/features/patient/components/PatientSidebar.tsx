import {
  Bell,
  Calendar,
  FileText,
  Home,
  MessageSquare,
  User,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useGetPatientProfile } from '../hooks/usePatientQueries'

interface PatientSidebarProps {
  activeTab: string
  unreadCount: number
}

interface NavItem {
  id: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  badge?: number
  href: string
}

export const PatientSidebar = ({
  activeTab,
  unreadCount,
}: PatientSidebarProps) => {
  const navItems: Array<NavItem> = [
    { id: 'home', icon: Home, label: 'Tổng quan', href: '/patient' },
    {
      id: 'appointments',
      icon: Calendar,
      label: 'Lịch hẹn khám',
      href: '/patient/appointments',
    },
    {
      id: 'records',
      icon: FileText,
      label: 'Hồ sơ bệnh án',
      href: '/patient/records',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Thông báo',
      badge: unreadCount,
      href: '/patient/notifications',
    },
    {
      id: 'chat',
      icon: MessageSquare,
      label: 'Chat với bác sĩ',
      href: '/patient/chat',
    },
    {
      id: 'profile',
      icon: User,
      label: 'Thông tin cá nhân',
      href: '/patient/profile',
    },
  ]

  const { data } = useGetPatientProfile()

  return (
    <aside className="fixed top-0 left-0 z-30 hidden h-screen w-72 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex h-18.25 items-center justify-center gap-2 border-b border-gray-100 p-6">
        <img src="/logo.png" alt="MedCare Logo" className="size-8" />
        <span className="text-xl leading-tight font-bold text-teal-700 group-data-[collapsible=icon]:hidden">
          MedCare
          <span className="text-gray-700">App</span>
        </span>
      </div>

      <div className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-teal-50 text-teal-700 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'
            }`}>
            <div className="flex items-center">
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  activeTab === item.id ? 'text-teal-600' : 'text-gray-400'
                }`}
              />
              {item.label}
            </div>
            {item.badge && item.badge > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center rounded-xl bg-gray-50 p-3">
          <img
            src={data?.user.avatar}
            alt=""
            className="h-10 w-10 rounded-full"
          />
          <div className="ml-3 overflow-hidden">
            <p className="truncate text-sm font-semibold text-gray-900">
              {data?.user.fullName}
            </p>
            <p className="text-xs text-gray-500">Mã: BN-{data?.userId}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
