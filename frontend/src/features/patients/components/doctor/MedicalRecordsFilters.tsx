import { Filter } from 'lucide-react'

import { MedicalRecordsFiltersSheet } from '@/features/medicalRecords/components/common/MedicalRecordsFiltersSheet'
import { Button } from '@/components/ui/button'

interface MedicalRecordsFiltersProps {
  createdFrom?: string
  createdTo?: string
  doctorFilter?: boolean
  onApplyFilters: (filters: {
    createdFrom?: string
    createdTo?: string
    doctorFilter?: boolean
  }) => void
}

export const MedicalRecordsFilters = ({
  createdFrom,
  createdTo,
  doctorFilter,
  onApplyFilters,
}: MedicalRecordsFiltersProps) => {
  const activeFilterCount = [
    Boolean(createdFrom || createdTo),
    Boolean(doctorFilter),
  ].filter(Boolean).length

  return (
    <MedicalRecordsFiltersSheet
      title="Bộ lọc lịch sử bệnh án"
      createdFrom={createdFrom}
      createdTo={createdTo}
      doctorFilter={doctorFilter}
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
    </MedicalRecordsFiltersSheet>
  )
}
