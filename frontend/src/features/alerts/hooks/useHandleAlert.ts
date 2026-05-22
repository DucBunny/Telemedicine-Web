import { useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import type { Alert } from '@/features/alerts/types'

import { alertApi } from '@/features/alerts/api/alert.api'
import { chatApi } from '@/features/chat/api/chat.api'
import { getErrorMessage } from '@/lib/axios'
import { useTelehealthCallStore } from '@/stores/telehealthCall.store'

/**
 * Giành quyền xử lý (nếu pending) rồi mở chat video kèm panel bệnh án theo alert
 */
export function useHandleAlert() {
  const navigate = useNavigate()
  const [isHandling, setIsHandling] = useState(false)

  const startHandlingAlert = useCallback(
    async (alert: Alert) => {
      const patientUserId = alert.patient?.userId ?? alert.patientId
      if (!patientUserId) {
        toast.error('Không xác định được bệnh nhân.')
        return
      }

      setIsHandling(true)
      try {
        let activeAlert = alert
        if (alert.status === 'pending') {
          activeAlert = await alertApi.claimHandling(alert.id)
        }

        const conversation =
          await chatApi.getConversationByUserIds(patientUserId)
        useTelehealthCallStore.getState().setPendingAlertForCall(activeAlert)

        navigate({
          to: '/doctor/chat/$conversationId',
          params: { conversationId: conversation.id },
          search: { startVideo: true, fromAlert: true },
        })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsHandling(false)
      }
    },
    [navigate],
  )

  return { startHandlingAlert, isHandling }
}
