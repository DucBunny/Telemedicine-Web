import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Check, Ellipsis } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { ChildPageHeader } from '@/features/patient/components/common'
import { NotificationItem } from '@/features/patient/components/notifications/NotificationItem'
import {
  useGetMyNotifications,
  useMarkAllNotificationsAsRead,
} from '@/features/patient/hooks/useNotificationQueries'
import Loader, { LoaderItem } from '@/components/Loader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { disconnectSocket, initSocket } from '@/lib/socket'
import { useAuthStore } from '@/stores/auth.store'

const filterOptions = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
]

export const NotificationsPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead()

  // Fetch notifications with infinite scroll (cursor pagination)
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMyNotifications({
    limit: 6,
    isRead: filter === 'unread' ? false : undefined,
  })

  // Infinite scroll trigger
  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  // Flatten all pages into a single list
  const notifications = data?.pages.flatMap((page) => page.data) ?? []

  useEffect(() => {
    // Khởi tạo socket khi component mount
    initSocket({ userId: user?.id })

    return () => {
      // Disconnect khi unmount
      disconnectSocket()
    }
  }, [user!.id])

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
            variant="ghost"
            size="sm"
            className="text-teal-primary! hidden rounded-full text-sm duration-200 active:scale-98 min-[500px]:flex"
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

        {/* Load more trigger */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetchingNextPage && <LoaderItem />}
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
