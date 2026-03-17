import { motion } from 'motion/react'
import { Hospital, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type VisitType = 'offline' | 'online'

const TOGGLE_OPTIONS: Array<{
  id: VisitType
  label: string
  icon: LucideIcon
}> = [
  { id: 'offline', label: 'Tại phòng khám', icon: Hospital },
  { id: 'online', label: 'Tư vấn Online', icon: Video },
]

interface VisitTypeToggleProps {
  value: VisitType
  onChange: (val: VisitType) => void
}

export const VisitTypeToggle = ({ value, onChange }: VisitTypeToggleProps) => (
  <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner">
    {TOGGLE_OPTIONS.map((option) => {
      const isActive = value === option.id

      return (
        <Button
          key={option.id}
          onClick={() => onChange(option.id)}
          variant="ghost"
          className={`relative z-10 flex-1 rounded-lg text-sm font-semibold ${
            isActive
              ? 'text-teal-primary hover:text-teal-primary'
              : 'text-gray-500 hover:text-gray-900'
          }`}>
          {isActive && (
            <motion.div
              layoutId="active-toggle-tab"
              className="absolute inset-0 rounded-lg bg-white shadow-sm"
              transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
              style={{ zIndex: -1 }}
            />
          )}

          <option.icon className="size-5" strokeWidth="2.5" />
          {option.label}
        </Button>
      )
    })}
  </div>
)
