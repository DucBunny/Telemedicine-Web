import { useNavigate } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'

import { HealthHistoryTimeline } from '@/features/alerts/components/patient'
import { useGetMyHealthHistory } from '@/features/alerts/hooks/useAlertQueries'
import LoaderScreen from '@/components/common/Loader'
import { ChildPageHeader, MainPageHeader } from '@/components/common/PageHeader'
import { PaginationControls } from '@/components/common/PaginationControls'
import { usePagination } from '@/hooks/usePagination'

export const HealthHistoryPage = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const p = usePagination({ initialPage: 1, initialLimit: 6 })

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
        <p className="flex flex-1 items-center justify-center py-12 text-sm text-red-500">
          Không thể tải lịch sử sức khỏe
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center text-slate-500">
          <Heart className="size-12 text-gray-300" />
          <p className="text-sm">Chưa có sự kiện sức khỏe nào.</p>
        </div>
      ) : (
        <HealthHistoryTimeline
          items={items}
          className="flex-1 justify-between"
        />
      )}

      <div className="py-4 md:px-2">
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
