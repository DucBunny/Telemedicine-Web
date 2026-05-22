import { useNavigate } from '@tanstack/react-router'
import { Activity, Heart } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'

import { useGetMyHealthHistory } from '@/features/alerts/hooks/useAlertQueries'
import { getPatientHealthHistoryMessage } from '@/features/alerts/utils/patient-health-history-message'
import LoaderScreen from '@/components/common/Loader'
import { ChildPageHeader, MainPageHeader } from '@/components/common/PageHeader'
import { PaginationControls } from '@/components/common/PaginationControls'
import { usePagination } from '@/hooks/usePagination'
import { formatShortDate, formatTime } from '@/lib/format-date'

export const HealthHistoryPage = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const p = usePagination({ initialPage: 1, initialLimit: 8 })

  const { data, isLoading, isError } = useGetMyHealthHistory({
    page: p.page,
    limit: p.limit,
  })

  const items = data?.data ?? []

  const handleBack = () => {
    navigate({ to: '/patient/profile' })
  }

  if (isLoading) return <LoaderScreen />

  return (
    <div className="flex h-full flex-col px-4">
      {isMobile ? (
        <ChildPageHeader title="Lịch sử sức khỏe" onBack={handleBack} />
      ) : (
        <MainPageHeader title="Lịch sử sức khỏe" onBack={handleBack} />
      )}

      {isError ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">Không thể tải lịch sử sức khỏe</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white p-10 text-center text-gray-500">
          <Heart className="size-12 text-gray-300" />
          <p>Chưa có mục nào trong lịch sử.</p>
        </div>
      ) : (
        <ul className="flex-1 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="bg-teal-primary/10 text-teal-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                <Activity className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-gray-900">
                  {getPatientHealthHistoryMessage(item)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatShortDate(item.createdAt)} ·{' '}
                  {formatTime(item.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="p-4 md:px-6">
        {data && data.meta.total > 0 ? (
          <PaginationControls
            currentPage={p.page}
            totalPages={data.meta.totalPages}
            totalItems={data.meta.total}
            itemsPerPage={p.limit}
            onPageChange={p.setPage}
            showItemsInfo
          />
        ) : null}
      </div>
    </div>
  )
}
