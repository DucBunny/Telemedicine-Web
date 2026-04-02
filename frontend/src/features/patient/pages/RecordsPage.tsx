import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebounceValue } from 'usehooks-ts'
import { MainPageHeader } from '@/features/patient/components/common/PageHeader'
import { SearchBar } from '@/features/patient/components/common/SearchBar'
import {
  RecordCard,
  RecordTable,
  StatCard,
} from '@/features/patient/components/medicalRecords'
import { useGetMyRecords } from '@/features/patient/hooks/useRecordQueries'
import { usePagination } from '@/hooks/usePagination'
import { formatShortDate } from '@/lib/format-date'
import Loader from '@/components/Loader'

export const RecordsPage = () => {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500) // 500ms delay before fetching
  const p = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const {
    data: recordsData,
    isLoading,
    error,
  } = useGetMyRecords({ page: p.page, limit: p.limit, search: debouncedSearch })

  const allRecords = recordsData?.data ?? []

  const handleRecordDetail = (recordId: string) => {
    navigate({ to: '/patient/records/$recordId', params: { recordId } })
  }

  const statsData = [
    {
      id: 'total',
      label: 'Tổng hồ sơ',
      value: String(allRecords.length),
      icon: 'clinical_notes',
      iconBgClass: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'last_visit',
      label: 'Lần khám cuối',
      value:
        allRecords.length > 0
          ? formatShortDate(allRecords[0]?.appointment?.scheduledAt ?? '')
          : '—',
      icon: 'calendar_month',
      iconBgClass: 'bg-teal-primary/15 text-teal-primary',
    },
  ]

  if (isLoading) return <Loader />

  if (error) {
    return (
      <div className="px-4">
        <MainPageHeader title="Hồ sơ bệnh án" />
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">Không thể tải danh sách hồ sơ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4">
      <MainPageHeader title="Hồ sơ bệnh án" />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Tìm kiếm chẩn đoán, bác sĩ..."
      />

      {/* Mobile / md layout */}
      <div className="space-y-3 py-3 md:space-y-6 md:py-6 lg:hidden">
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {statsData.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconBgClass={stat.iconBgClass}
            />
          ))}
        </div>

        <section className="space-y-3 md:space-y-4">
          <h2 className="mb-3 text-sm font-bold tracking-wider text-gray-500 uppercase">
            Lịch sử khám bệnh
          </h2>

          {allRecords.length > 0 ? (
            allRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onClick={handleRecordDetail}
              />
            ))
          ) : (
            <div className="py-10 text-center text-gray-500">
              {search
                ? 'Không tìm thấy kết quả phù hợp.'
                : 'Chưa có hồ sơ nào.'}
            </div>
          )}
        </section>
      </div>

      {/* Desktop layout */}
      <div className="mt-6 hidden lg:block">
        <RecordTable
          data={recordsData}
          onViewDetail={handleRecordDetail}
          pagination={p}
        />
      </div>
    </div>
  )
}
