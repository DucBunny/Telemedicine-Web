import { useEffect, useMemo, useState } from 'react'
import { vi } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'

import type { ReactElement } from 'react'
import type { DateRange } from 'react-day-picker'
import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'

import {
  APPOINTMENT_FILTER_STATUS_OPTIONS,
  APPOINTMENT_FILTER_TYPE_OPTIONS,
} from '@/features/appointments/constants/appointmentFilters.constants'
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
import {
  formatDateRangeLabel,
  formatTime,
  parseDateInput,
  toUtcIsoFromVietnamLocal,
} from '@/lib/format-date'
import { cn } from '@/lib/utils'

export type AppointmentFiltersApplyPayload = {
  statusFilter: 'all' | AppointmentStatus
  typeFilter: 'all' | AppointmentType
  scheduledFrom?: string
  scheduledTo?: string
}

interface AppointmentFiltersSheetProps {
  title: string
  emptyDateRangeLabel?: string
  statusFilter: 'all' | AppointmentStatus
  typeFilter: 'all' | AppointmentType
  scheduledFrom?: string
  scheduledTo?: string
  onApplyFilters: (filters: AppointmentFiltersApplyPayload) => void
  children: ReactElement
}

export const AppointmentFiltersSheet = ({
  title,
  emptyDateRangeLabel = 'Chọn khoảng thời gian',
  statusFilter,
  typeFilter,
  scheduledFrom,
  scheduledTo,
  onApplyFilters,
  children,
}: AppointmentFiltersSheetProps) => {
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

  // Handle draft state when the sheet is opened
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

  // Handle apply filters
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

  // Handle reset filters
  const handleReset = () => {
    setDraftStatus('all')
    setDraftTypeFilter('all')
    setDraftDateRange(undefined)
    setDraftStartTime('')
    setDraftEndTime('')
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="bottom"
        className="max-h-[80vh] w-full gap-5 overflow-y-auto rounded-t-3xl px-4 py-5 sm:px-6 md:p-8">
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg font-bold sm:text-xl">
            {title}
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
                    {formatDateRangeLabel(draftDateRange, emptyDateRangeLabel)}
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
                <Label className="text-xs font-medium text-gray-500">Từ</Label>
                <Input
                  type="time"
                  value={draftStartTime}
                  onChange={(event) => setDraftStartTime(event.target.value)}
                  className="shadow-xs"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-medium text-gray-500">Đến</Label>
                <Input
                  type="time"
                  value={draftEndTime}
                  onChange={(event) => setDraftEndTime(event.target.value)}
                  className="shadow-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium">Loại khám</Label>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              {APPOINTMENT_FILTER_TYPE_OPTIONS.map((filter) => (
                <Button
                  key={filter.id}
                  type="button"
                  variant={
                    draftTypeFilter === filter.id ? 'teal_blur' : 'outline'
                  }
                  size="lg"
                  onClick={() => setDraftTypeFilter(filter.id)}
                  className={cn('flex-1', filter.id === 'all' && 'col-span-2')}>
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium">Trạng thái</Label>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              {APPOINTMENT_FILTER_STATUS_OPTIONS.map((filter) => (
                <Button
                  key={filter.id}
                  type="button"
                  variant={draftStatus === filter.id ? 'teal_blur' : 'outline'}
                  size="lg"
                  onClick={() => setDraftStatus(filter.id)}
                  className={cn('flex-1', filter.id === 'all' && 'col-span-2')}>
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
  )
}
