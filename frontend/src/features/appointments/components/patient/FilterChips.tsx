import { Button } from '@/components/ui/button'

const FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'exp_5', label: 'Kinh nghiệm > 5 năm' },
  { id: 'exp_10', label: 'Kinh nghiệm > 10 năm' },
] as const

interface FilterChipsProps {
  activeFilter: string
  onSelect: (id: string) => void
}

export const FilterChips = ({ activeFilter, onSelect }: FilterChipsProps) => (
  <div className="scrollbar-hide flex gap-2 overflow-x-auto py-0.5">
    {FILTERS.map((filter) => {
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
