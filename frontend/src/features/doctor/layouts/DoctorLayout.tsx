import React from 'react'
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import type { SidebarMenuItem } from '@/components/layouts/Sidebar'
import { AppLayout } from '@/components/layouts/AppLayout'

const menuItems: Array<SidebarMenuItem> = [
  { href: '/doctor', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/doctor/patients', label: 'Bệnh nhân', icon: Users },
  { href: '/doctor/appointments', label: 'Lịch khám', icon: Calendar },
  { href: '/doctor/messages', label: 'Tin nhắn', icon: MessageSquare },
  { href: '/doctor/settings', label: 'Cài đặt', icon: Settings },
]

export const DoctorLayout = ({ children }: { children: React.ReactNode }) => {
  const handleLogout = () => {
    console.log('Logging out...')
  }

  return (
    <AppLayout
      menuItems={menuItems}
      userInfo={{
        name: 'BS. Nguyễn Văn Hùng',
        role: 'Khoa Tim Mạch',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        avatarFallback: 'BS',
      }}
      searchPlaceholder="Tìm kiếm hồ sơ, bệnh nhân..."
      onLogout={handleLogout}>
      {children}
    </AppLayout>
  )
}
