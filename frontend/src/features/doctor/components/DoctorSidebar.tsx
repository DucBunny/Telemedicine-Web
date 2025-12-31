import { Link, useLocation } from '@tanstack/react-router'
import {
  Activity,
  Calendar,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DoctorSidebarProps {
  className?: string
  onClose?: () => void // Prop để đóng sidebar trên mobile
}

export const DoctorSidebar = ({ className, onClose }: DoctorSidebarProps) => {
  // Giả sử dùng hook useLocation từ TanStack Router
  // const location = useLocation();
  // const pathname = location.pathname;
  const pathname = '/doctor' // Mock tạm để hiện active state

  const menuItems = [
    { href: '/doctor', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/doctor/patients', label: 'Bệnh nhân', icon: Users },
    { href: '/doctor/appointments', label: 'Lịch khám', icon: Calendar },
    { href: '/doctor/messages', label: 'Tin nhắn', icon: MessageSquare },
    { href: '/doctor/settings', label: 'Cài đặt', icon: Settings },
  ]

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-slate-200 bg-white',
        className,
      )}>
      {/* Header / Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-2 text-xl font-bold text-teal-700">
          <div className="rounded-md bg-teal-600 p-1">
            <Activity className="h-5 w-5 text-white" />
          </div>
          MedCare
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
            )}
            onClick={onClose} // Đóng menu khi click (quan trọng cho mobile)
          >
            <item.icon
              className={cn(
                'h-5 w-5',
                pathname === item.href ? 'text-teal-600' : 'text-slate-400',
              )}
            />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="shrink-0 border-t border-slate-100 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
