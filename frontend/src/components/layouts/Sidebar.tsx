import { Link, useLocation } from '@tanstack/react-router'
import { Activity, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface SidebarMenuItem {
  href: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  className?: string
  onClose?: () => void
  menuItems: Array<SidebarMenuItem>
  title?: string
  onLogout?: () => void
}

export const Sidebar = ({
  className,
  onClose,
  menuItems,
  title = 'MedCare',
  onLogout,
}: SidebarProps) => {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-slate-200 bg-white',
        className,
      )}>
      {/* Header / Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-teal-700">
          <div className="rounded-md bg-teal-600 p-1">
            <Activity className="h-5 w-5 text-white" />
          </div>
          {title}
        </Link>
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
            onClick={onClose}>
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
          onClick={onLogout}
          className="w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
