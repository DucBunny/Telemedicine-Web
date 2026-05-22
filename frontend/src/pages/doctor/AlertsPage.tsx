import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import type { AlertStatus } from '@/features/alerts/types'

import { AlertsTable, Filters } from '@/features/alerts/components/doctor'
import { useGetMyAlerts } from '@/features/alerts/hooks/useAlertQueries'
import { usePagination } from '@/hooks/usePagination'
import { Route } from '@/routes/doctor/alerts'
import { selectUser, useAuthStore } from '@/stores/auth.store'

export const AlertsPage = () => {
  const { status: statusFromSearch } = Route.useSearch()
  const doctor = useAuthStore(selectUser)

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500) // 500ms delay before fetching

  const [statusFilter, setStatusFilter] = useState<'all' | AlertStatus>(
    () => statusFromSearch ?? 'all',
  )
  const [createdFrom, setCreatedFrom] = useState<string | undefined>(undefined)
  const [createdTo, setCreatedTo] = useState<string | undefined>(undefined)
  const [handledByFilter, setHandledByFilter] = useState<boolean | undefined>(
    undefined,
  )
  const p = usePagination({
    initialPage: 1,
    initialLimit: 5,
  })

  const handleApplyFilters = ({
    statusFilter: nextStatusFilter,
    handledByFilter: nextHandledByFilter,
    createdFrom: nextCreatedFrom,
    createdTo: nextCreatedTo,
  }: {
    statusFilter: 'all' | AlertStatus
    handledByFilter?: boolean
    createdFrom?: string
    createdTo?: string
  }) => {
    setStatusFilter(nextStatusFilter)
    setHandledByFilter(nextHandledByFilter)
    setCreatedFrom(nextCreatedFrom)
    setCreatedTo(nextCreatedTo)
    p.reset()
  }

  const { data, isLoading, isError } = useGetMyAlerts({
    page: p.page,
    limit: p.limit,
    status: statusFilter === 'all' ? undefined : statusFilter,
    handledBy: handledByFilter ? doctor?.id : undefined,
    createdFrom,
    createdTo,
    search: debouncedSearch,
  })

  useEffect(() => {
    p.reset()
  }, [debouncedSearch])

  return (
    <div className="mx-auto space-y-4 p-4 md:space-y-6 md:p-0">
      <Filters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        handledByFilter={handledByFilter}
        createdFrom={createdFrom}
        createdTo={createdTo}
        onApplyFilters={handleApplyFilters}
      />

      <AlertsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        pagination={p}
      />
    </div>
  )
}
