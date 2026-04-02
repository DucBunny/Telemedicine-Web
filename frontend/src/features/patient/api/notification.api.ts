import type {
  ApiCursorPaginatedResponse,
  ApiSuccessResponse,
} from '@/types/api.type'
import type { Notification } from '@/features/patient/types'
import type { GetMyNotificationsParams } from '@/features/patient/dto/notification.dto'
import { apiClient } from '@/lib/axios'

const NOTIFICATION_BASE = '/notifications'

export const notificationApi = {
  /**
   * Get notifications for logged in user
   */
  getNotifications: async (params?: GetMyNotificationsParams) => {
    const { data } = await apiClient.get<
      ApiCursorPaginatedResponse<Notification>
    >('/me/notifications', { params })
    return data
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async () => {
    const { data } = await apiClient.get<ApiSuccessResponse<{ count: number }>>(
      `${NOTIFICATION_BASE}/unread-count`,
    )
    return data.data.count
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: number) => {
    const { data } = await apiClient.put<ApiSuccessResponse<Notification>>(
      `${NOTIFICATION_BASE}/${id}/read`,
    )
    return data.data
  },

  /**
   * Mark notification as unread
   */
  markAsUnread: async (id: number) => {
    const { data } = await apiClient.put<ApiSuccessResponse<Notification>>(
      `${NOTIFICATION_BASE}/${id}/unread`,
    )
    return data.data
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const { data } = await apiClient.put<
      ApiSuccessResponse<{ success: boolean }>
    >(`${NOTIFICATION_BASE}/read-all`)
    return data.data
  },

  /**
   * Delete notification
   */
  deleteNotification: async (id: number) => {
    const { data } = await apiClient.delete<
      ApiSuccessResponse<{ success: boolean }>
    >(`${NOTIFICATION_BASE}/${id}`)
    return data.data
  },
}
