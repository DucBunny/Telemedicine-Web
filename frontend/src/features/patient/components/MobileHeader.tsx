import React from 'react'
import { Activity, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export const MobileHeader = () => {
  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] bg-teal-600 p-6 pb-24 text-white shadow-xl md:hidden">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/30 shadow-sm">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User Avatar"
            />
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
  )
}
