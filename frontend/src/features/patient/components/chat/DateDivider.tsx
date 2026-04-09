import { format, isThisYear, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

interface DateDividerProps {
  date: Date
}

export const DateDivider = ({ date }: DateDividerProps) => {
  const formatDate = (d: Date): string => {
    if (isToday(d)) return 'Hôm nay'
    if (isYesterday(d)) return 'Hôm qua'
    if (isThisYear(d)) return format(d, 'EEEE, dd/MM', { locale: vi })

    return format(d, 'EEEE, dd/MM/yyyy', { locale: vi })
  }

  return (
    <div className="flex items-center justify-center py-3">
      <Badge variant="teal_blur" className="text-xs!">
        {formatDate(date)}
      </Badge>
    </div>
  )
}
