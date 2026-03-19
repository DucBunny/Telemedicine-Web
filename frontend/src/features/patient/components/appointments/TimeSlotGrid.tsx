import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface TimeSlot {
  time: string
  isAvailable: boolean
}

interface TimeSlotGridProps {
  title: string
  icon: LucideIcon
  iconColor: string
  slots: Array<TimeSlot>
  selectedTime: string
  onSelectTime: (time: string) => void
}

export const TimeSlotGrid = ({
  title,
  icon: Icon,
  iconColor,
  slots,
  selectedTime,
  onSelectTime,
}: TimeSlotGridProps) => {
  const availableSlots = slots.filter((s) => s.isAvailable).length

  return (
    <div>
      <div className="mb-3 flex items-center justify-between lg:flex-col lg:items-start xl:flex-row xl:items-center">
        <div className="flex items-center gap-2">
          <Icon className={`size-5.5 ${iconColor}`} strokeWidth="2.5" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
        </div>

        <span className="text-xs font-medium text-slate-500">
          ({availableSlots} slots trống)
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 lg:grid-cols-2">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time
          return (
            <Button
              key={slot.time}
              disabled={!slot.isAvailable}
              onClick={() => onSelectTime(slot.time)}
              variant={isSelected ? 'teal_primary' : 'outline'}
              className={`rounded-xl text-sm transition-all ${
                !slot.isAvailable
                  ? 'cursor-not-allowed opacity-50'
                  : isSelected
                    ? 'scale-105 transform shadow-md shadow-teal-500/25'
                    : ''
              }`}>
              {slot.time}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
