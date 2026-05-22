import { useEffect } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { BellRing } from 'lucide-react'
import { toast } from 'sonner'

import type { GetMyNotificationsParams } from '@/features/notifications/types/notification.dto'
import type { NotificationPayload } from '@/sockets/socket.types'

import { notificationApi } from '@/features/notifications/api/notification.api'
import {
  addNotificationListener,
  addNotificationReadListener,
  addUnreadCountListener,
} from '@/stores/systemSocket.store'

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,

  lists: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
  list: (params?: { limit?: number; isRead?: boolean }) =>
    [...NOTIFICATION_KEYS.lists(), params] as const,

  details: () => [...NOTIFICATION_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...NOTIFICATION_KEYS.details(), id] as const,

  unreadCount: () => [...NOTIFICATION_KEYS.all, 'unread-count'] as const,
}

/**
 * Hook to get notifications with infinite scroll (cursor pagination)
 */
export const useGetMyNotifications = (params: GetMyNotificationsParams) => {
  return useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: ({ pageParam }) =>
      notificationApi.getNotifications({
        ...params,
        nextCursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
  })
}

/**
 * Hook to get unread notification count
 */
export const useGetUnreadNotificationCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: () => notificationApi.getUnreadCount(),
    // refetchInterval: 30000, // Refetch every 30 seconds
  })
}

/**
 * Hook to mark notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.detail(id) })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      })
    },
  })
}

/**
 * Hook to mark notification as unread
 */
export const useMarkNotificationAsUnread = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificationApi.markAsUnread(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.detail(id) })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      })
    },
  })
}

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      })
    },
  })
}

/**
 * Hook to delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificationApi.deleteNotification(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.detail(id) })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      })
    },
  })
}

/**
 * Hook to listen for realtime notifications via systemSocket (/system namespace).
 * Dùng addNotificationListener từ systemSocket.store thay vì legacy socket (/ namespace).
 */
export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = addNotificationListener(
      (notification: NotificationPayload) => {
        // Hiển thị toast ngay lập tức (ưu tiên hàng đầu)
        toast('Thông báo mới', {
          description: notification.title,
          duration: 5000,
          icon: <BellRing className="size-4.5" />,
        })

        // Cập nhật unread count trực tiếp vào cache (không trigger HTTP request)
        queryClient.setQueryData(
          NOTIFICATION_KEYS.unreadCount(),
          (old: number | undefined) => (old ?? 0) + 1,
        )

        // Invalidate danh sách notification (defer nhẹ để không ảnh hưởng toast)
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: NOTIFICATION_KEYS.lists(),
          })
        }, 300)
      },
    )

    const unsubscribeRead = addNotificationReadListener(({ id }) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.detail(id) })
    })

    const unsubscribeUnreadCount = addUnreadCountListener(({ count }) => {
      queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), count)
    })

    return () => {
      unsubscribe()
      unsubscribeRead()
      unsubscribeUnreadCount()
    }
  }, [queryClient])
}
