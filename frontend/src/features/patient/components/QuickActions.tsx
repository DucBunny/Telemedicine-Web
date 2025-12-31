import React from 'react'
import { Activity, Calendar, MessageSquare, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Helper Item
const QuickActionButton = ({
  icon: Icon,
  label,
  color,
}: {
  icon: LucideIcon
  label: string
  color: string
}) => (
  <button className="group flex flex-col items-center gap-2">
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-110',
        color,
      )}>
      <Icon className="h-6 w-6" />
    </div>
    <span className="text-xs font-medium text-slate-600">{label}</span>
  </button>
)

export const QuickActions = () => {
  return (
    <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur-md">
      <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-800 uppercase">
        Dịch vụ nhanh
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <QuickActionButton
          icon={Phone}
          label="Gọi BS"
          color="bg-emerald-100 text-emerald-600"
        />
        <QuickActionButton
          icon={Calendar}
          label="Lịch"
          color="bg-orange-100 text-orange-600"
        />
        <QuickActionButton
          icon={Activity}
          label="Đo ngay"
          color="bg-purple-100 text-purple-600"
        />
        <QuickActionButton
          icon={MessageSquare}
          label="Chat"
          color="bg-blue-100 text-blue-600"
        />
      </div>
    </div>
  )
}
