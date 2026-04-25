import { useEffect, useMemo, useState } from 'react'
import { vi } from 'date-fns/locale'
import { CalendarDays, Filter, Plus, Search } from 'lucide-react'

import type { DateRange } from 'react-day-picker'
import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'

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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  formatShortDate,
  formatTime,
  parseDateInput,
  toUtcIsoFromVietnamLocal,
} from '@/lib/format-date'
import { cn } from '@/lib/utils'

interface FiltersProps {
  statusFilter: 'all' | AppointmentStatus
  typeFilter: 'all' | AppointmentType
  search: string
  setSearch: (term: string) => void
  scheduledFrom?: string
  scheduledTo?: string
  onApplyFilters: (filters: {
    statusFilter: 'all' | AppointmentStatus
    typeFilter: 'all' | AppointmentType
    scheduledFrom?: string
    scheduledTo?: string
  }) => void
}

const statusFilters: Array<{
  id: 'all' | AppointmentStatus
  label: string
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ duyệt' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
]

const typeFilters: Array<{
  id: 'all' | AppointmentType
  label: string
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'offline', label: 'Trực tiếp' },
  { id: 'online', label: 'Online' },
]

const formatDateRangeLabel = (range?: DateRange) => {
  if (!range?.from && !range?.to) return 'Chọn khoảng ngày giờ'

  return `${formatShortDate(range.from || '')} - ${formatShortDate(range.to || '')}`
}

export const Filters = ({
  statusFilter,
  typeFilter,
  search,
  setSearch,
  scheduledFrom,
  scheduledTo,
  onApplyFilters,
}: FiltersProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState<'all' | AppointmentStatus>(
    statusFilter,
  )
  const [draftTypeFilter, setDraftTypeFilter] = useState<
    'all' | AppointmentType
  >(typeFilter)
  const [draftDateRange, setDraftDateRange] = useState<DateRange | undefined>()
  const [draftStartTime, setDraftStartTime] = useState('')
  const [draftEndTime, setDraftEndTime] = useState('')

  useEffect(() => {
    if (!isSheetOpen) return

    setDraftStatus(statusFilter)
    setDraftTypeFilter(typeFilter)
    setDraftDateRange(
      scheduledFrom || scheduledTo
        ? {
            from: scheduledFrom ? parseDateInput(scheduledFrom) : undefined,
            to: scheduledTo ? parseDateInput(scheduledTo) : undefined,
          }
        : undefined,
    )
    setDraftStartTime(scheduledFrom ? formatTime(scheduledFrom) : '')
    setDraftEndTime(scheduledTo ? formatTime(scheduledTo) : '')
  }, [isSheetOpen, scheduledFrom, scheduledTo, statusFilter, typeFilter])

  // Check if the start time is after the end time
  const isApplyDisabled = useMemo(() => {
    if (!draftDateRange?.from || !draftDateRange.to) return false
    if (!draftStartTime || !draftEndTime) return false

    const fromIso = toUtcIsoFromVietnamLocal(
      draftDateRange.from,
      draftStartTime,
    )
    const toIso = toUtcIsoFromVietnamLocal(draftDateRange.to, draftEndTime)

    return new Date(fromIso) > new Date(toIso)
  }, [draftDateRange, draftEndTime, draftStartTime])

  // Apply filters
  const handleApply = () => {
    onApplyFilters({
      statusFilter: draftStatus,
      typeFilter: draftTypeFilter,
      scheduledFrom: draftDateRange?.from
        ? toUtcIsoFromVietnamLocal(
            draftDateRange.from,
            draftStartTime || '00:00',
          )
        : undefined,
      scheduledTo: draftDateRange?.to
        ? toUtcIsoFromVietnamLocal(draftDateRange.to, draftEndTime || '23:59')
        : undefined,
    })
    setIsSheetOpen(false)
  }

  // Reset filters
  const handleReset = () => {
    setDraftStatus('all')
    setDraftTypeFilter('all')
    setDraftDateRange(undefined)
    setDraftStartTime('')
    setDraftEndTime('')
  }

  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="relative w-full min-w-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-5 text-gray-400" />
        </div>
        <Input
          name="search"
          type="text"
          className="bg-gray-50 px-10 leading-5 text-gray-900 transition-all focus-visible:ring-teal-500 focus-visible:ring-offset-0"
          placeholder="Tìm bệnh nhân..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="absolute top-1/2 right-1 -translate-y-1/2 transform">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-sm" type="button">
                <Filter className="size-4" />
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

              <div className="grid flex-1 auto-rows-min gap-3">
                <div className="grid gap-3">
                  <Label className="text-sm font-medium">Thời gian hẹn</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full justify-start gap-2 font-normal">
                        <CalendarDays className="size-4 text-gray-500" />
                        <span className="line-clamp-2 text-sm text-gray-700">
                          {formatDateRangeLabel(draftDateRange)}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="max-w-sm p-0 sm:max-w-md"
                      align="start">
                      <Calendar
                        mode="range"
                        selected={draftDateRange}
                        onSelect={setDraftDateRange}
                        captionLayout="dropdown"
                        locale={vi}
                        className="w-full"
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium text-gray-500">
                        Từ
                      </Label>
                      <Input
                        type="time"
                        value={draftStartTime}
                        onChange={(event) =>
                          setDraftStartTime(event.target.value)
                        }
                        className="shadow-xs"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium text-gray-500">
                        Đến
                      </Label>
                      <Input
                        type="time"
                        value={draftEndTime}
                        onChange={(event) =>
                          setDraftEndTime(event.target.value)
                        }
                        className="shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Type filter */}
                <div className="grid gap-3">
                  <Label className="text-sm font-medium">Loại khám</Label>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                    {typeFilters.map((filter) => (
                      <Button
                        key={filter.id}
                        type="button"
                        variant={
                          draftTypeFilter === filter.id
                            ? 'teal_blur'
                            : 'outline'
                        }
                        size="lg"
                        onClick={() => setDraftTypeFilter(filter.id)}
                        className={cn(
                          'flex-1',
                          filter.id === 'all' && 'col-span-2',
                        )}>
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status filter */}
                <div className="grid gap-3">
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                    {statusFilters.map((filter) => (
                      <Button
                        key={filter.id}
                        type="button"
                        variant={
                          draftStatus === filter.id ? 'teal_blur' : 'outline'
                        }
                        size="lg"
                        onClick={() => setDraftStatus(filter.id)}
                        className={cn(
                          'flex-1',
                          filter.id === 'all' && 'col-span-2',
                        )}>
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-col gap-3 p-0 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:flex-1"
                  size="lg"
                  onClick={handleReset}>
                  Đặt lại
                </Button>
                <Button
                  type="button"
                  variant="teal_primary"
                  size="lg"
                  className="w-full sm:flex-1"
                  onClick={handleApply}
                  disabled={isApplyDisabled}>
                  Áp dụng
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mt-4 hidden w-full items-center justify-between space-x-3 md:flex">
        <div className="hidden w-full space-x-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0 lg:flex">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              variant="ghost"
              type="button"
              onClick={() => {
                onApplyFilters({
                  statusFilter: filter.id,
                  typeFilter,
                  scheduledFrom,
                  scheduledTo,
                })
              }}
              className={cn(
                'h-9 shrink-0 text-xs transition-colors',
                statusFilter === filter.id
                  ? 'bg-teal-primary text-white shadow-sm hover:bg-teal-700 hover:text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}>
              {filter.label}
            </Button>
          ))}
        </div>

        <Select
          onValueChange={(value) =>
            onApplyFilters({
              statusFilter: value as 'all' | AppointmentStatus,
              typeFilter,
              scheduledFrom,
              scheduledTo,
            })
          }
          value={statusFilter}>
          <SelectTrigger className="bg-teal-primary rounded-lg border-0 text-xs font-medium text-white shadow-sm transition-colors hover:bg-teal-700 md:text-sm lg:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="start">
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              {statusFilters.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="teal_primary" className="h-9 text-xs" type="button">
          <Plus /> <span className="hidden md:block">Đặt lịch mới</span>
        </Button>
      </div>
    </div>
  )
}
