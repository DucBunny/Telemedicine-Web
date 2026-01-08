import { Filter, Plus, Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface FiltersProps {
  filterStatus: string
  setFilterStatus: (status: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const filters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'pending', label: 'Chờ duyệt' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
]

export const Filters = ({
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
}: FiltersProps) => {
  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Search */}
      <div className="relative w-full min-w-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-5 text-gray-400" />
        </div>
        <Input
          type="text"
          className="bg-gray-50 px-10 leading-5 text-gray-900 transition-all focus-visible:ring-teal-500 focus-visible:ring-offset-0"
          placeholder="Tìm bệnh nhân..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="absolute top-1/2 right-1 -translate-y-1/2 transform">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <Filter className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="gap-8 rounded-t-3xl p-8">
              <SheetHeader className="p-0">
                <SheetTitle className="text-xl font-bold">
                  Bộ lọc tìm kiếm
                </SheetTitle>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6">
                <div className="grid gap-3">
                  <Label>Thời gian</Label>
                </div>
                <div className="grid gap-3">
                  <Label>Loại khám</Label>
                  <div className="flex justify-around gap-4">
                    <Button className="flex-1" variant="outline">
                      Tất cả
                    </Button>
                    <Button className="flex-1" variant="outline">
                      Khám trực tiếp
                    </Button>
                    <Button className="flex-1" variant="outline">
                      Khám từ xa
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label>Trạng thái</Label>
                  <div className="flex justify-around gap-4">
                    {filters.map((f) => (
                      <Button
                        key={f.id}
                        variant="outline"
                        onClick={() => setFilterStatus(f.id)}
                        className={cn(
                          'h-10 flex-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors md:text-sm',
                          filterStatus === f.id
                            ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm hover:bg-teal-50/70 hover:text-teal-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        )}>
                        {f.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-row p-0">
                <Button
                  variant="secondary"
                  className="flex-1 text-gray-600 hover:bg-gray-200">
                  Đặt lại
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700">
                  Áp dụng
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mt-4 hidden w-full items-center justify-between space-x-3 md:flex">
        <div className="hidden w-full space-x-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0 lg:flex">
          {filters.map((f) => (
            <Button
              key={f.id}
              variant="ghost"
              onClick={() => setFilterStatus(f.id)}
              className={cn(
                'h-9 shrink-0 rounded-lg text-xs font-medium whitespace-nowrap transition-colors md:text-sm',
                filterStatus === f.id
                  ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}>
              {f.label}
            </Button>
          ))}
        </div>

        <Select onValueChange={setFilterStatus} value={filterStatus}>
          <SelectTrigger className="rounded-lg border-0 bg-teal-600 text-xs font-medium text-white shadow-sm transition-colors hover:bg-teal-700 md:text-sm lg:hidden [&_svg]:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              {filters.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="h-9 bg-teal-600 text-xs whitespace-nowrap text-white shadow-sm hover:bg-teal-700 md:text-sm">
          <Plus /> <span className="hidden md:block">Đặt lịch mới</span>
        </Button>
      </div>
    </div>
  )
}
