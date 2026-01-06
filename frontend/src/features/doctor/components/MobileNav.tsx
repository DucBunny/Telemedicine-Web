import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  icon: LucideIcon
  label: string
}

interface MobileNavProps {
  activeTab: string
  setActiveTab: (id: string) => void
}

const navItems: Array<NavItem> = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { id: 'appointments', icon: Calendar, label: 'Lịch hẹn' },
  { id: 'patients', icon: Users, label: 'Bệnh nhân' },
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'settings', icon: Settings, label: 'Cài đặt' },
]

export const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white p-2 shadow-lg md:hidden">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => setActiveTab(item.id)}
          className={cn(
            'flex h-12 flex-1 flex-col gap-0 duration-200',
            activeTab === item.id
              ? 'text-teal-600 hover:text-teal-600'
              : 'text-gray-400 hover:text-gray-600',
          )}>
          <item.icon
            className="size-5"
            strokeWidth={activeTab === item.id ? 2.5 : 2}
          />
          <span className="mt-1 text-[10px] font-medium">{item.label}</span>
        </Button>
      ))}
    </div>
  )
}
