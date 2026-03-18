import { Button } from '@/components/ui/button'

export interface FilterOption {
  id: string
  label: string
}

interface FilterChipsProps {
  filters: Array<FilterOption>
  activeFilter: string
  onSelect: (id: string) => void
}

export const FilterChips = ({
  filters,
  activeFilter,
  onSelect,
}: FilterChipsProps) => (
  <div className="scrollbar-hide flex gap-2 overflow-x-auto py-0.5">
    {filters.map((filter) => {
      const isActive = activeFilter === filter.id

      return (
        <Button
          key={filter.id}
          onClick={() => onSelect(filter.id)}
          variant={isActive ? 'teal_primary' : 'outline'}
          size="sm"
          className="rounded-full font-semibold whitespace-nowrap first:ms-4 last:me-4">
          {filter.label}
        </Button>
      )
    })}
  </div>
)
