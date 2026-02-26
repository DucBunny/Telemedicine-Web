import { STATUS_FILTER_OPTIONS } from '../../config'
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
    <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
      {DISPLAY_OPTIONS.map((status) => (
        <Button
          key={status.value}
          variant="ghost"
          onClick={() => onChange(status.value)}
          className={`flex-1 rounded-lg px-4 py-2 text-xs font-medium transition ${
            value === status.value
              ? 'bg-white text-gray-900 shadow-sm hover:bg-white'
              : 'text-gray-500 hover:bg-white hover:text-gray-900'
          }`}>
          {status.label}
        </Button>
      ))}
    </div>
  )
}
