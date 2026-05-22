import type { Alert } from '@/features/alerts/types'

import { alertApi } from '@/features/alerts/api/alert.api'
import { useAuthStore } from '@/stores/auth.store'
import { useTelehealthCallStore } from '@/stores/telehealthCall.store'

/**
 * Kết thúc cuộc gọi mà alert vẫn handling → trả về pending trên server
 */
export async function releaseAlertHandlingOnCallEnd(
  alert: Alert | null | undefined,
) {
  const doctor = useAuthStore.getState().user
  if (!doctor || doctor.role !== 'doctor' || !alert) return
  if (alert.status !== 'handling' || alert.handledBy !== doctor.id) return

  try {
    await alertApi.releaseHandling(alert.id)
  } catch {
    // Không chặn luồng đóng cuộc gọi nếu API lỗi
  }
}

/**
 * Kết thúc cuộc gọi mà alert vẫn handling → trả về pending trên server.
 * Xóa panel bệnh án và cờ nhẹ từ store.
 */
export async function finalizeAlertVisitOnCallEnd() {
  const alert = useTelehealthCallStore.getState().activeAlertForVisit
  await releaseAlertHandlingOnCallEnd(alert)
  useTelehealthCallStore.getState().setActiveAlertForVisit(null)
  useTelehealthCallStore.getState().setActiveVisitFromAlert(false)
}
