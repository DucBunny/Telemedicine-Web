import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface VitalsCardProps {
  title: string
  value: string | number
  unit: string
  icon: LucideIcon
  status?: 'normal' | 'warning' | 'danger'
}

export const VitalsCard: React.FC<VitalsCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  status = 'normal',
}) => {
  const statusConfig = {
    normal: { text: 'text-slate-900', iconBg: 'bg-blue-50 text-blue-600' },
    warning: {
      text: 'text-orange-600',
      iconBg: 'bg-orange-50 text-orange-600',
    },
    danger: {
      text: 'text-rose-600 animate-pulse',
      iconBg: 'bg-rose-50 text-rose-600',
    },
  }

  const config = statusConfig[status]

  return (
    <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div className={cn('rounded-full p-4 shadow-sm', config.iconBg)}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
            {title}
          </p>
          <div
            className={cn(
              'text-4xl font-extrabold tracking-tight',
              config.text,
            )}>
            {value}{' '}
            <span className="text-muted-foreground ml-1 text-sm font-semibold">
              {unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
