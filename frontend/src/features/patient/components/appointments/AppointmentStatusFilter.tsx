import { motion } from 'motion/react'
import { STATUS_FILTER_OPTIONS } from '@/features/patient/config'
import { Button } from '@/components/ui/button'

const DISPLAY_OPTIONS = STATUS_FILTER_OPTIONS.slice(2, 5) // upcoming, completed, cancelled

interface AppointmentStatusFilterProps {
  value: string
  onChange: (value: string) => void
}

export const AppointmentStatusFilter = ({
  value,
  onChange,
}: AppointmentStatusFilterProps) => {
  return (
    <div className="flex rounded-3xl bg-gray-100 p-1 shadow-inner">
      {DISPLAY_OPTIONS.map((status) => {
        const isActive = value === status.value

        return (
          <Button
            key={status.value}
            variant="ghost"
            onClick={() => onChange(status.value)}
            className={`relative z-10 flex-1 rounded-2xl text-sm font-semibold ${
              isActive
                ? 'text-teal-primary hover:text-teal-primary'
                : 'text-gray-500 hover:text-gray-900'
            }`}>
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-2xl bg-white shadow-sm"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                style={{ zIndex: -1 }}
              />
            )}

            <span className="relative z-10">{status.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
