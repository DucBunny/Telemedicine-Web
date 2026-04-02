import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Check, Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChildPageHeader } from '@/features/patient/components/common'
import { NotificationItem } from '@/features/patient/components/notifications/NotificationItem'
import {
  useGetMyNotificationsInfinite,
  useMarkAllNotificationsAsRead,
} from '@/features/patient/hooks/useNotificationQueries'
import Loader, { LoaderItem } from '@/components/Loader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const filterOptions = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
]

export const NotificationsPage = () => {
  const navigate = useNavigate()

  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead()

  const sentinelRef = useRef<HTMLDivElement>(null) // người gác cổng: báo hiệu khi nào thì fetch trang tiếp theo

  // Fetch notifications with infinite scroll (cursor pagination)
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useGetMyNotificationsInfinite({
    limit: 6,
    isRead: filter === 'unread' ? false : undefined,
  })

  // Flatten all pages into a single list
  const notifications = data?.pages.flatMap((page) => page.data) ?? []

  // IntersectionObserver: tự động fetch trang tiếp theo khi sentinel vào viewport
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        /**
         * entry.isIntersecting: true khi sentinel vào viewport
         * hasNextPage: true khi còn trang tiếp theo
         * isFetchingNextPage: true khi đang fetch trang tiếp theo
         * { threshold: 0.1 }: khi sentinel cách viewport 10% thì fetch trang tiếp theo
         */
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    // Bắt đầu quan sát sentinel
    observer.observe(sentinel)

    // Dọn dẹp khi component unmount
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleBack = () => {
    navigate({ to: '/patient' })
  }

  if (isLoading) return <Loader />

  if (error)
    return (
      <div className="px-4">
        <ChildPageHeader title="Thông báo" onBack={handleBack} />
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">Không thể tải danh sách thông báo</p>
        </div>
      </div>
    )

  return (
    <div className="px-4">
      <ChildPageHeader
        title="Thông báo"
        onBack={handleBack}
        rightAction={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="icon" size="icon-lg">
                <Ellipsis className="min-[500px]:hidden" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => markAllAsRead()}>
                Đánh dấu tất cả là đã đọc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <main className="space-y-3 md:space-y-4">
        {/* Tabs */}
        <div className="scrollbar-hide flex items-center justify-between overflow-x-auto">
          <div className="flex gap-3">
            {filterOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => setFilter(option.id as 'all' | 'unread')}
                variant={filter === option.id ? 'teal_primary' : 'outline'}
                className="rounded-full text-sm shadow-none">
                {option.label}
              </Button>
            ))}
          </div>

          <Button
            variant="teal_outline"
            size="sm"
            className="hidden h-6.5 rounded-full text-sm duration-200 active:scale-98 min-[500px]:flex"
            onClick={() => markAllAsRead()}>
            <Check />
            Đánh dấu tất cả là đã đọc
          </Button>
        </div>

        {/* Danh sách thông báo */}
        {notifications.length > 0 ? (
          notifications.map((noti) => (
            <NotificationItem key={noti.id} notification={noti} />
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">
            Không có thông báo nào.
          </div>
        )}

        {/* Sentinel – điểm mốc để trigger fetch trang tiếp theo */}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />

        {/* Loading indicator khi đang fetch trang tiếp */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <LoaderItem />
          </div>
        )}

        {/* Thông báo đã xem hết */}
        {!hasNextPage && notifications.length > 0 && (
          <div className="p-10 pt-4 text-center text-sm text-gray-500">
            Bạn đã xem hết thông báo.
          </div>
        )}
      </main>
    </div>
  )
}
