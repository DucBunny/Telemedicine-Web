import { Filter, Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export const Filters = ({ searchTerm, setSearchTerm }: FiltersProps) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Simple Filter Bar */}
      <div className="flex w-full space-x-2 sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên, CMND..."
            className="h-9 border-gray-200 bg-white pl-9 text-xs focus-visible:ring-teal-500 focus-visible:ring-offset-0 md:text-sm"
          />
        </div>
        <Button
          variant="outline"
          className="h-9 border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50">
          <Filter className="mr-2 h-4 w-4" /> Bộ lọc
        </Button>
      </div>
      <Button variant="teal_primary" className="h-9 w-full sm:w-auto">
        <Users className="mr-2 h-4 w-4" /> Thêm bệnh nhân
      </Button>
    </div>
  )
}
