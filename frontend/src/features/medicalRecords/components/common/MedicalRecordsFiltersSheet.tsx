import { useEffect, useMemo, useState } from 'react'
import { vi } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'

import type { ReactElement } from 'react'
import type { DateRange } from 'react-day-picker'

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
  formatDateRangeLabel,
  formatTime,
  parseDateInput,
  toUtcIsoFromVietnamLocal,
} from '@/lib/format-date'

export type MedicalRecordsFiltersApplyPayload = {
  createdFrom?: string
  createdTo?: string
  doctorFilter?: boolean
}

interface MedicalRecordsFiltersSheetProps {
  title: string
  emptyDateRangeLabel?: string
  createdFrom?: string
  createdTo?: string
  doctorFilter?: boolean
  onApplyFilters: (filters: MedicalRecordsFiltersApplyPayload) => void
  children: ReactElement
}

export const MedicalRecordsFiltersSheet = ({
  title,
  emptyDateRangeLabel = 'Chọn khoảng thời gian',
  createdFrom,
  createdTo,
  doctorFilter,
  onApplyFilters,
  children,
}: MedicalRecordsFiltersSheetProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [draftDateRange, setDraftDateRange] = useState<DateRange | undefined>()
  const [draftStartTime, setDraftStartTime] = useState('')
  const [draftEndTime, setDraftEndTime] = useState('')
  const [draftDoctorFilter, setDraftDoctorFilter] = useState(false)

  // Handle draft state when the sheet is opened
  useEffect(() => {
    if (!isSheetOpen) return

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
    setDraftDoctorFilter(doctorFilter ?? false)
  }, [isSheetOpen, createdFrom, createdTo, doctorFilter])

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
      createdFrom: draftDateRange?.from
        ? toUtcIsoFromVietnamLocal(
            draftDateRange.from,
            draftStartTime || '00:00',
          )
        : undefined,
      createdTo: draftDateRange?.to
        ? toUtcIsoFromVietnamLocal(draftDateRange.to, draftEndTime || '23:59')
        : undefined,
      doctorFilter: draftDoctorFilter,
    })
    setIsSheetOpen(false)
  }

  // Handle reset filters
  const handleReset = () => {
    setDraftDateRange(undefined)
    setDraftStartTime('')
    setDraftEndTime('')
    setDraftDoctorFilter(false)
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

        <div className="grid flex-1 auto-rows-min gap-4">
          <div>
            <div>
              <Label className="text-sm! font-medium!">Thời gian tạo</Label>
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
                        draftDateRange,
                        emptyDateRangeLabel,
                      )}
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

          <div className="mt-1 flex items-center gap-4">
            <Label className="text-sm! font-medium!">
              Được thực hiện bởi tôi
            </Label>
            <Switch
              className="data-[state=checked]:bg-teal-primary"
              checked={draftDoctorFilter}
              onCheckedChange={setDraftDoctorFilter}
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
  )
}
