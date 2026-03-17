import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}: SearchBarProps) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Search className="size-5 text-gray-400" strokeWidth="2.5" />
    </div>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border-gray-200 pl-10 text-base shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0"
      placeholder={placeholder}
    />
  </div>
)
