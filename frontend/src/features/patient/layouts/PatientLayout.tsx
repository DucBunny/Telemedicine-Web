import React from 'react'
import {
  Activity,
  Bell,
  Calendar,
  Home,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Helper: Bottom Navigation Item
const BottomNavItem = ({ icon: Icon, label, active }: any) => (
  <button
    className={cn(
      'flex flex-col items-center gap-1',
      active ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600',
    )}>
    <Icon className="h-6 w-6" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
)

export const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 md:pb-8">
      {/* Mobile Header (Only visible on small screens) */}
      <div className="relative overflow-hidden rounded-b-[2.5rem] bg-teal-600 p-6 pb-24 text-white shadow-xl md:hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/30 shadow-sm">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <div>
              <p className="mb-0.5 text-xs font-medium text-teal-100">
                Xin chào,
              </p>
              <h2 className="text-xl font-bold tracking-tight">Nguyễn Văn A</h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-teal-600 bg-rose-400" />
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="md:mx-auto md:max-w-4xl md:pt-8">
        <div className="relative z-20 -mt-16 px-5 md:hidden">
          {/* Mobile overlap content starts here */}
          {children}
        </div>
        <div className="hidden px-6 md:block">
          {/* Desktop content */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tổng quan sức khỏe</h1>
            <Avatar>
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
          </div>
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="fixed right-6 bottom-6 left-6 z-50 flex items-center justify-between rounded-2xl border border-white/20 bg-white/90 px-6 py-3 shadow-2xl backdrop-blur-xl md:hidden">
        <BottomNavItem icon={Home} label="Home" active />
        <BottomNavItem icon={Calendar} label="Lịch" />
        <div className="-mt-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-4 border-slate-50 bg-teal-600 text-white shadow-[0_8px_20px_rgba(13,148,136,0.4)] transition-transform hover:scale-105">
          <Phone className="h-6 w-6" />
        </div>
        <BottomNavItem icon={MessageSquare} label="Chat" />
        <BottomNavItem icon={User} label="Hồ sơ" />
      </div>
    </div>
  )
}
