import type { PatientHealthHistoryItem } from '@/features/alerts/types/alert.dto'

import {
  getHealthHistoryTimelineItem,
  getHealthTimelineStyles,
} from '@/features/alerts/utils/health-history-timeline'
import { formatRelativeDate, formatTime } from '@/lib/format-date'
import { cn } from '@/lib/utils'

interface HealthHistoryTimelineProps {
  items: Array<PatientHealthHistoryItem>
  className?: string
}

export const HealthHistoryTimeline = ({
  items,
  className,
}: HealthHistoryTimelineProps) => (
  <ul className={cn('relative flex flex-col overflow-y-auto px-1', className)}>
    {/* Line vertical */}
    {items.length > 1 && (
      <div
        className="absolute top-14 bottom-2 left-5 w-px bg-slate-200"
        aria-hidden="true"
      />
    )}

    {items.map((item) => {
      const display = getHealthHistoryTimelineItem(item)
      const styles = getHealthTimelineStyles(display.variant)
      const isResolved = item.status === 'resolved'
      const isHandling = item.status === 'handling'

      return (
        <li
          key={item.id}
          className="relative ml-10 flex flex-1 gap-3 border-b border-slate-100 py-4 last:border-b-0 lg:py-0">
          {/* Icon */}
          <span
            className={cn(
              'absolute top-1/2 -left-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full',
              styles.iconBg,
            )}>
            <span
              className="material-symbols-outlined text-lg!"
              style={{ fontVariationSettings: '"FILL" 1' }}>
              {isResolved ? 'check_circle' : display.icon}
            </span>
          </span>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="text-[11px] text-slate-400">
              {formatTime(item.createdAt)} ·{' '}
              {formatRelativeDate(item.createdAt)}
            </p>
            <p className={cn('text-sm font-bold', styles.title)}>
              {display.title}
            </p>
            <p className="text-xs leading-relaxed text-slate-500">
              {display.subtitle}
              {isResolved && ' - đã được bác sĩ ghi nhận'}
              {isHandling && ' - đang được xem xét'}
            </p>
          </div>
        </li>
      )
    })}
  </ul>
)
