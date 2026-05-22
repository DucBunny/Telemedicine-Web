import { useEffect, useMemo, useState } from 'react'
import { vi } from 'date-fns/locale'
import { CalendarDays, Filter, Search } from 'lucide-react'

import type { DateRange } from 'react-day-picker'
import type { AlertStatus } from '@/features/alerts/types'

import { ALERT_FILTER_STATUS_OPTIONS } from '@/features/alerts/constants/alertFilters.contants'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  formatShortDate,
  formatTime,
  parseDateInput,
  toUtcIsoFromVietnamLocal,
} from '@/lib/format-date'

interface FiltersProps {
  search: string
  setSearch: (value: string) => void
  statusFilter: 'all' | AlertStatus
  handledByFilter?: boolean
  createdFrom?: string
  createdTo?: string
  onApplyFilters: (filters: {
    statusFilter: 'all' | AlertStatus
    handledByFilter?: boolean
    createdFrom?: string
    createdTo?: string
  }) => void
}

const formatDateRangeLabel = (range?: DateRange) => {
  if (!range?.from && !range?.to) return 'Chọn khoảng thời gian'

  return `${formatShortDate(range.from || '')} - ${formatShortDate(range.to || '')}`
}

export const Filters = ({
  search,
  setSearch,
  statusFilter,
  handledByFilter,
  createdFrom,
  createdTo,
  onApplyFilters,
}: FiltersProps) => {
  const activeFilterCount = [
    statusFilter !== 'all',
    Boolean(createdFrom || createdTo),
    Boolean(handledByFilter),
  ].filter(Boolean).length

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState<'all' | AlertStatus>(
    statusFilter,
  )
  const [draftHandledByFilter, setDraftHandledByFilter] = useState<boolean>(
    handledByFilter ?? false,
  )
  const [draftDateRange, setDraftDateRange] = useState<DateRange | undefined>()
  const [draftStartTime, setDraftStartTime] = useState('')
  const [draftEndTime, setDraftEndTime] = useState('')

  useEffect(() => {
    if (!isSheetOpen) return

    setDraftStatus(statusFilter)
    setDraftHandledByFilter(handledByFilter ?? false)
    setDraftDateRange(
      createdFrom || createdTo
        ? {
            from: createdFrom ? parseDateInput(createdFrom) : undefined,
            to: createdTo ? parseDateInput(createdTo) : undefined,
          }
        : undefined,
    )
    setDraftStartTime(createdFrom ? formatTime(createdFrom) : '')
    setDraftEndTime(createdTo ? formatTime(createdTo) : '')
  }, [statusFilter, handledByFilter, createdFrom, createdTo, isSheetOpen])

  // Check if the apply button is disabled
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

  const handleApply = () => {
    onApplyFilters({
      statusFilter: draftStatus,
      handledByFilter: draftHandledByFilter,
      createdFrom: draftDateRange?.from
        ? toUtcIsoFromVietnamLocal(
            draftDateRange.from,
            draftStartTime || '00:00',
          )
        : undefined,
      createdTo: draftDateRange?.to
        ? toUtcIsoFromVietnamLocal(draftDateRange.to, draftEndTime || '23:59')
        : undefined,
    })

    setIsSheetOpen(false)
  }

  const handleReset = () => {
    setDraftStatus('all')
    setDraftHandledByFilter(false)
    setDraftDateRange(undefined)
    setDraftStartTime('')
    setDraftEndTime('')
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
              <div>
                <Label className="text-sm! font-medium!">
                  Thời gian cảnh báo
                </Label>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-medium! text-gray-500!">Từ</Label>
                  <Input
                    type="time"
                    value={draftStartTime}
                    onChange={(event) => setDraftStartTime(event.target.value)}
                    className="shadow-xs"
                  />
                </div>
                <div>
                  <Label className="font-medium! text-gray-500!">Đến</Label>
                  <Input
                    type="time"
                    value={draftEndTime}
                    onChange={(event) => setDraftEndTime(event.target.value)}
                    className="shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm! font-medium!">Trạng thái</Label>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                {ALERT_FILTER_STATUS_OPTIONS.map((filter) => (
                  <Button
                    key={filter.id}
                    type="button"
                    variant={
                      draftStatus === filter.id ? 'teal_blur' : 'outline'
                    }
                    size="lg"
                    onClick={() => setDraftStatus(filter.id)}
                    className="flex-1">
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-1 flex items-center gap-4">
              <Label className="text-sm! font-medium!">
                Được xử lý bởi tôi
              </Label>
              <Switch
                className="data-[state=checked]:bg-teal-primary"
                checked={draftHandledByFilter}
                onCheckedChange={setDraftHandledByFilter}
              />
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
              onClick={handleApply}
              disabled={isApplyDisabled}>
              Áp dụng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
