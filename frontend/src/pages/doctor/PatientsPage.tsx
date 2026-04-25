import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import type { BloodTypeOption, GenderOption } from '@/features/patients/types'

import { Filters, PatientsTable } from '@/features/patients/components/doctor'
import { useGetMyPatients } from '@/features/patients/hooks/usePatientQueries'
import { usePagination } from '@/hooks/usePagination'

export const PatientsPage = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500) // 500ms delay before fetching

  const [bloodTypeFilter, setBloodTypeFilter] = useState<
    'all' | BloodTypeOption
  >('all')
  const [genderFilter, setGenderFilter] = useState<'all' | GenderOption>('all')
  const [dobFrom, setDobFrom] = useState<string | undefined>(undefined)
  const [dobTo, setDobTo] = useState<string | undefined>(undefined)
  const p = usePagination({
    initialPage: 1,
    initialLimit: 5,
  })

  const handleApplyFilters = ({
    bloodTypeFilter: nextBloodTypeFilter,
    genderFilter: nextGenderFilter,
    dobFrom: nextDobFrom,
    dobTo: nextDobTo,
  }: {
    bloodTypeFilter: 'all' | BloodTypeOption
    genderFilter: 'all' | GenderOption
    dobFrom?: string
    dobTo?: string
  }) => {
    setBloodTypeFilter(nextBloodTypeFilter)
    setGenderFilter(nextGenderFilter)
    setDobFrom(nextDobFrom)
    setDobTo(nextDobTo)
    p.reset()
  }

  const { data, isLoading, isError } = useGetMyPatients({
    page: p.page,
    limit: p.limit,
    bloodType: bloodTypeFilter === 'all' ? undefined : bloodTypeFilter,
    gender: genderFilter === 'all' ? undefined : genderFilter,
    dobFrom,
    dobTo,
    search: debouncedSearch,
  })

  return (
    <div className="mx-auto space-y-4 p-4 md:space-y-6">
      <Filters
        search={search}
        setSearch={setSearch}
        bloodTypeFilter={bloodTypeFilter}
        genderFilter={genderFilter}
        dobFrom={dobFrom}
        dobTo={dobTo}
        onApplyFilters={handleApplyFilters}
      />

      <PatientsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        pagination={p}
      />
    </div>
  )
}
