import { Filter, Plus, Search } from 'lucide-react'

import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'

import { AppointmentFiltersSheet } from '@/features/appointments/components/common/AppointmentFiltersSheet'
import { APPOINTMENT_FILTER_STATUS_OPTIONS } from '@/features/appointments/constants/appointmentFilters.constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  onOpenCreateAppointment: () => void
}

export const Filters = ({
  statusFilter,
  typeFilter,
  search,
  setSearch,
  scheduledFrom,
  scheduledTo,
  onApplyFilters,
  onOpenCreateAppointment,
}: FiltersProps) => {
  const activeFilterCount = [
    statusFilter !== 'all',
    typeFilter !== 'all',
    Boolean(scheduledFrom || scheduledTo),
  ].filter(Boolean).length

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
          <AppointmentFiltersSheet
            title="Bộ lọc tìm kiếm"
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            scheduledFrom={scheduledFrom}
            scheduledTo={scheduledTo}
            onApplyFilters={onApplyFilters}>
            <Button
              variant={activeFilterCount > 0 ? 'teal_primary' : 'outline'}
              size="sm"
              type="button">
              <Filter className="size-4" />
              {activeFilterCount > 0 && (
                <span className="text-teal-primary flex size-4 items-center justify-center rounded-full bg-white text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </AppointmentFiltersSheet>
        </div>
      </div>

      <div className="mt-4 hidden w-full items-center justify-between space-x-3 md:flex">
        <div className="hidden w-full space-x-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0 lg:flex">
          {APPOINTMENT_FILTER_STATUS_OPTIONS.map((filter) => (
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
              {APPOINTMENT_FILTER_STATUS_OPTIONS.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="teal_primary"
          className="h-9"
          type="button"
          onClick={onOpenCreateAppointment}>
          <Plus /> <span className="hidden md:inline">Tạo lịch mới</span>
        </Button>
      </div>
    </div>
  )
}
