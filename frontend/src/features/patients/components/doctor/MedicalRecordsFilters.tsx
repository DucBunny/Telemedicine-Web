import { Filter } from 'lucide-react'

import { MedicalRecordsFiltersSheet } from '@/features/medicalRecords/components/common/MedicalRecordsFiltersSheet'
import { Button } from '@/components/ui/button'

interface MedicalRecordsFiltersProps {
  createdFrom?: string
  createdTo?: string
  onApplyFilters: (filters: {
    createdFrom?: string
    createdTo?: string
  }) => void
}

export const MedicalRecordsFilters = ({
  createdFrom,
  createdTo,
  onApplyFilters,
}: MedicalRecordsFiltersProps) => {
  const hasActiveFilters = Boolean(createdFrom || createdTo)

  return (
    <MedicalRecordsFiltersSheet
      title="Bộ lọc lịch sử bệnh án"
      createdFrom={createdFrom}
      createdTo={createdTo}
      onApplyFilters={onApplyFilters}>
      <Button
        variant={hasActiveFilters ? 'teal_primary' : 'outline'}
        size="sm"
        type="button">
        <Filter className="size-4" />
        <span className="hidden md:block">Bộ lọc</span>
        {hasActiveFilters && (
          <span className="text-teal-primary flex size-4 items-center justify-center rounded-full bg-white text-xs">
            1
          </span>
        )}
      </Button>
    </MedicalRecordsFiltersSheet>
  )
}
