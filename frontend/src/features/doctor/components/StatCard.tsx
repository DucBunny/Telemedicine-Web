import React from 'react'
import { TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down'
  }
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}) => {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow hover:shadow-md',
        className,
      )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* {(description || trend) && (
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            {trend && (
              <span
                className={cn(
                  'flex items-center font-medium',
                  trend.direction === 'up'
                    ? 'text-emerald-500'
                    : 'text-rose-500',
                )}>
                {trend.direction === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingUp className="mr-1 h-3 w-3 rotate-180" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            <span className="opacity-70">{trend?.label || description}</span>
          </p>
        )} */}
      </CardContent>
    </Card>
  )
}
