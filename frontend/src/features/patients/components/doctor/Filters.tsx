import { useEffect, useState } from 'react'
import { vi } from 'date-fns/locale'
import { CalendarDays, Filter, Search } from 'lucide-react'

import type { DateRange } from 'react-day-picker'
import type { BloodTypeOption, GenderOption } from '@/features/patients/types'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  formatDateForApi,
  formatDateRangeLabel,
  parseDateInput,
} from '@/lib/format-date'
import { BLOOD_TYPE_OPTIONS, GENDER_OPTIONS } from '@/types/constants'

interface FiltersProps {
  search: string
  setSearch: (value: string) => void
  bloodTypeFilter: 'all' | BloodTypeOption
  genderFilter: 'all' | GenderOption
  dobFrom?: string
  dobTo?: string
  onApplyFilters: (filters: {
    bloodTypeFilter: 'all' | BloodTypeOption
    genderFilter: 'all' | GenderOption
    dobFrom?: string
    dobTo?: string
  }) => void
}

export const Filters = ({
  search,
  setSearch,
  bloodTypeFilter,
  genderFilter,
  dobFrom,
  dobTo,
  onApplyFilters,
}: FiltersProps) => {
  const activeFilterCount = [
    bloodTypeFilter !== 'all',
    genderFilter !== 'all',
    Boolean(dobFrom || dobTo),
  ].filter(Boolean).length

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [draftBloodType, setDraftBloodType] = useState<'all' | BloodTypeOption>(
    bloodTypeFilter,
  )
  const [draftGender, setDraftGender] = useState<'all' | GenderOption>(
    genderFilter,
  )
  const [draftDobRange, setDraftDobRange] = useState<DateRange | undefined>()

  useEffect(() => {
    if (!isSheetOpen) return

    setDraftBloodType(bloodTypeFilter)
    setDraftGender(genderFilter)
    setDraftDobRange(
      dobFrom || dobTo
        ? {
            from: dobFrom ? parseDateInput(dobFrom) : undefined,
            to: dobTo ? parseDateInput(dobTo) : undefined,
          }
        : undefined,
    )
  }, [bloodTypeFilter, dobFrom, dobTo, genderFilter, isSheetOpen])

  const handleApply = () => {
    onApplyFilters({
      bloodTypeFilter: draftBloodType,
      genderFilter: draftGender,
      dobFrom: draftDobRange?.from
        ? formatDateForApi(draftDobRange.from)
        : undefined,
      dobTo: draftDobRange?.to ? formatDateForApi(draftDobRange.to) : undefined,
    })
    setIsSheetOpen(false)
  }

  const handleReset = () => {
    setDraftBloodType('all')
    setDraftGender('all')
    setDraftDobRange(undefined)
  }

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="relative w-full max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm bệnh nhân..."
          className="h-9 border-gray-200 bg-white pl-9 text-xs focus-visible:ring-teal-500 focus-visible:ring-offset-0 md:text-sm"
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant={activeFilterCount > 0 ? 'teal_primary' : 'outline'}
            type="button">
            <Filter className="size-4" />
            <span className="hidden md:block">Bộ lọc</span>
            {activeFilterCount > 0 && (
              <span className="text-teal-primary flex size-4 items-center justify-center rounded-full bg-white text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="max-h-[80vh] w-full gap-5 overflow-y-auto rounded-t-3xl px-4 py-5 sm:px-6 md:px-8 md:py-8">
          <SheetHeader className="p-0">
            <SheetTitle className="text-lg font-bold sm:text-xl">
              Bộ lọc tìm kiếm
            </SheetTitle>
            <SheetDescription />
          </SheetHeader>

          <div className="grid flex-1 auto-rows-min gap-4">
            <div>
              <Label className="text-sm! font-medium!">Ngày sinh</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full justify-start gap-2 font-normal">
                    <CalendarDays className="size-4 text-gray-500" />
                    <span className="line-clamp-2 text-sm text-gray-700">
                      {formatDateRangeLabel(
                        draftDobRange,
                        'Chọn khoảng ngày sinh',
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="max-w-sm p-0 sm:max-w-md"
                  align="start">
                  <Calendar
                    mode="range"
                    selected={draftDobRange}
                    onSelect={setDraftDobRange}
                    captionLayout="dropdown"
                    locale={vi}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm! font-medium!">Giới tính</Label>
                <Select
                  value={draftGender}
                  onValueChange={(value) =>
                    setDraftGender(value as 'all' | GenderOption)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">Tất cả</SelectItem>
                    {GENDER_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm! font-medium!">Nhóm máu</Label>
                <Select
                  value={draftBloodType}
                  onValueChange={(value) =>
                    setDraftBloodType(value as 'all' | BloodTypeOption)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn nhóm máu" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">Tất cả</SelectItem>
                    {BLOOD_TYPE_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <SheetFooter className="flex-col gap-3 p-0 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="w-full text-sm sm:flex-1"
              size="lg"
              onClick={handleReset}>
              Đặt lại
            </Button>
            <Button
              type="button"
              variant="teal_primary"
              size="lg"
              className="w-full text-sm sm:flex-1"
              onClick={handleApply}>
              Áp dụng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
