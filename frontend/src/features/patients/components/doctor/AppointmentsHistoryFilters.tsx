import { Filter } from 'lucide-react'

import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'

import { AppointmentFiltersSheet } from '@/features/appointments/components/common/AppointmentFiltersSheet'
import { Button } from '@/components/ui/button'

interface AppointmentsHistoryFiltersProps {
  statusFilter: 'all' | AppointmentStatus
  typeFilter: 'all' | AppointmentType
  scheduledFrom?: string
  scheduledTo?: string
  onApplyFilters: (filters: {
    statusFilter: 'all' | AppointmentStatus
    typeFilter: 'all' | AppointmentType
    scheduledFrom?: string
    scheduledTo?: string
  }) => void
}

export const AppointmentsHistoryFilters = ({
  statusFilter,
  typeFilter,
  scheduledFrom,
  scheduledTo,
  onApplyFilters,
}: AppointmentsHistoryFiltersProps) => {
  const activeFilterCount = [
    statusFilter !== 'all',
    typeFilter !== 'all',
    Boolean(scheduledFrom || scheduledTo),
  ].filter(Boolean).length

  return (
    <AppointmentFiltersSheet
      title="Bộ lọc lịch sử hẹn"
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      scheduledFrom={scheduledFrom}
      scheduledTo={scheduledTo}
      onApplyFilters={onApplyFilters}>
      <Button
        variant={activeFilterCount > 0 ? 'teal_primary' : 'outline'}
        size="sm"
        type="button">
        <Filter className="size-4" />
        <span className="hidden md:block">Bộ lọc</span>
        {activeFilterCount > 0 && (
          <span className="text-teal-primary flex size-4 items-center justify-center rounded-full bg-white text-xs">
            {activeFilterCount}
          </span>
        )}
      </Button>
    </AppointmentFiltersSheet>
  )
}
