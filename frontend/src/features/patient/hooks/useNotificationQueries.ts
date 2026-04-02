import { useEffect } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Notification } from '@/features/patient/types'
import { getSocket } from '@/lib/socket'
import { notificationApi } from '@/features/patient/api/notification.api'

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
export const useGetMyNotificationsInfinite = (params?: {
  limit?: number
  isRead?: boolean
}) => {
  return useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: ({ pageParam }) =>
      notificationApi.getNotifications({
        ...params,
        nextCursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
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
 * Hook to listen for realtime notifications via socket
 */
export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewNotification = (notification: Notification) => {
      // Refresh notification lists and unread count
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      })

      // Show toast notification
      toast(notification.title || 'Thông báo mới', {
        description: notification.content,
      })
    }

    socket.on('notification:new', handleNewNotification)

    return () => {
      socket.off('notification:new', handleNewNotification)
    }
  }, [queryClient])
}
