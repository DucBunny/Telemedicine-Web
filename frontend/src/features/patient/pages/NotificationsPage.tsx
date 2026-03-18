import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { NotificationDetailDialog } from '../components/notifications'
import type { NotificationItemData } from '@/features/patient/data/notificationsMockData'
import { Button } from '@/components/ui/button'
import { ChildPageHeader } from '@/features/patient/components/common'
import { useHideMobileNav } from '@/features/patient/hooks/useHideMobileNav'
import { NotificationItem } from '@/features/patient/components/notifications/NotificationItem'
import { MOCK_NOTIFICATIONS } from '@/features/patient/data/notificationsMockData'

const filterOptions = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
]

export const NotificationsPage = () => {
  useHideMobileNav()

  const router = useRouter()

  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] =
    useState<Array<NotificationItemData>>(MOCK_NOTIFICATIONS)
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItemData | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const handleBack = () => {
    router.history.back()
  }

  const handleNotificationClick = (id: string) => {
    const notification = notifications.find((noti) => noti.id === id)
    if (notification) {
      setSelectedNotification(notification)
    }
  }

  const displayedNotifications = notifications.filter((notif) =>
    filter === 'all' ? true : notif.isUnread,
  )

  return (
    <div className="px-4">
      <ChildPageHeader title="Thông báo" onBack={handleBack} />

      <main className="space-y-3">
        {/* Tabs */}
        <div className="scrollbar-hide flex gap-3 overflow-x-auto">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              onClick={() => setFilter(option.id as 'all' | 'unread')}
              variant={filter === option.id ? 'teal_primary' : 'outline'}
              className="rounded-full text-sm">
              {option.label}
            </Button>
          ))}
        </div>

        {/* Danh sách thông báo */}
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((noti) => (
            <NotificationItem
              key={noti.id}
              data={noti}
              onClick={(id) => {
                handleNotificationClick(id)
                setIsDetailDialogOpen(true)
              }}
            />
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">
            Không có thông báo nào.
          </div>
        )}

        {MOCK_NOTIFICATIONS.length > 0 && (
          <div className="p-10 pt-6 text-center text-sm text-gray-500">
            Bạn đã xem hết thông báo.
          </div>
        )}
      </main>

      <NotificationDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={() => setIsDetailDialogOpen(false)}
        notification={selectedNotification}
      />
    </div>
  )
}
