import { useEffect } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import type { Alert } from '@/features/alerts/types'
import type {
  GetMyAlertsParams,
  ResolveAlertBody,
} from '@/features/alerts/types/alert.dto'
import type { AlertFlashPayload } from '@/sockets/socket.types'
import type { ApiPaginatedResponse } from '@/types/api.type'

import { alertApi } from '@/features/alerts/api/alert.api'
import { getErrorMessage } from '@/lib/axios'
import {
  addAlertCalmListener,
  addAlertFlashListener,
  addAlertNewListener,
  addAlertUpdateListener,
} from '@/stores/systemSocket.store'
import { useTelehealthCallStore } from '@/stores/telehealthCall.store'

export const ALERT_KEYS = {
  all: ['alerts'] as const,
  lists: () => [...ALERT_KEYS.all, 'list'] as const,
  list: (params: GetMyAlertsParams) => [...ALERT_KEYS.lists(), params] as const,

  healthHistoryLists: () => [...ALERT_KEYS.all, 'health-history'] as const,
  healthHistoryList: (params: { page?: number; limit?: number }) =>
    [...ALERT_KEYS.healthHistoryLists(), params] as const,
}

/**
 * Hook to get my alerts
 */
export const useGetMyAlerts = (params: GetMyAlertsParams) => {
  return useQuery({
    queryKey: ALERT_KEYS.list(params),
    queryFn: () => alertApi.getMyAlerts(params),
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook to get my health history
 */
export const useGetMyHealthHistory = (params: {
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ALERT_KEYS.healthHistoryList(params),
    queryFn: () => alertApi.getMyHealthHistory(params),
    placeholderData: keepPreviousData,
  })
}

/**
 * Patch alert in list caches
 */
const patchAlertInListCaches = (
  queryClient: ReturnType<typeof useQueryClient>,
  updated: Alert,
) => {
  queryClient.setQueriesData<ApiPaginatedResponse<Alert>>(
    { queryKey: ALERT_KEYS.lists() },
    (old) => {
      if (!old?.data) return old
      return {
        ...old,
        data: old.data.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      }
    },
  )
}

/**
 * Hook to mark alert as read
 */
export const useMarkAlertAsRead = () => {
  return useMutation({
    mutationFn: (alertId: number) => alertApi.markAsRead(alertId),
  })
}

/**
 * Hook to claim alert handling
 */
export const useClaimAlertHandling = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (alertId: number) => alertApi.claimHandling(alertId),
    onSuccess: (alert) => {
      patchAlertInListCaches(queryClient, alert)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Hook to resolve alert
 */
export const useResolveAlert = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      alertId,
      payload,
    }: {
      alertId: number
      payload: ResolveAlertBody
    }) => alertApi.resolveAlert(alertId, payload),
    onSuccess: ({ alert }) => {
      patchAlertInListCaches(queryClient, alert)
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      useTelehealthCallStore.getState().setActiveAlertForVisit(null)
      toast.success('Đã chốt ca và lưu hồ sơ bệnh án')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Lắng nghe alert:warning + alert:updated
 */
export const useRealtimeAlerts = (options?: {
  /** MQTT abnormal + alert pending */
  onAlertFlash?: (payload: AlertFlashPayload) => void
  /** MQTT normal — cho phép nháy lại khi abnormal tiếp (alert vẫn pending) */
  onAlertCalm?: (alertId: number) => void
  /** Claim hoặc resolve — dừng nháy hẳn */
  onStopAlertFlash?: (alertId: number) => void
}) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribeFlash = addAlertFlashListener((payload) => {
      options?.onAlertFlash?.(payload)
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.lists() })
    })

    const unsubscribeCalm = addAlertCalmListener((payload) => {
      options?.onAlertCalm?.(payload.alertId)
    })

    const unsubscribeNew = addAlertNewListener((alert) => {
      // if (showNewAlertToast) {
      toast.error('Cảnh báo sức khỏe mới', {
        description: alert.message,
        duration: 8000,
      })
      // }
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
    })

    const unsubscribeUpdate = addAlertUpdateListener((alert) => {
      patchAlertInListCaches(queryClient, alert)
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      if (alert.status === 'handling' || alert.status === 'resolved') {
        options?.onStopAlertFlash?.(alert.id)
      }
    })

    return () => {
      unsubscribeFlash()
      unsubscribeCalm()
      unsubscribeNew()
      unsubscribeUpdate()
    }
  }, [
    queryClient,
    options?.onAlertFlash,
    options?.onAlertCalm,
    options?.onStopAlertFlash,
  ])
}
