import { useState } from 'react'
import { Filters } from '../components/patients/Filters'
import { PatientsTable } from '../components/patients/PatientsTable'
import { useGetPatients } from '../hooks/usePatientQueries'
import { usePagination } from '@/hooks/usePagination'

export const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const p = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const { data, isLoading, isError } = useGetPatients({
    page: p.page,
    limit: p.limit,
    search: searchTerm,
  })

  return (
    <div className="mx-auto space-y-4 md:space-y-6">
      <Filters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PatientsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        pagination={p}
      />
    </div>
  )
}
