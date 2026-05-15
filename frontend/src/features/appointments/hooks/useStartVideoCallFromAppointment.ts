import { useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import type { Appointment } from '@/features/appointments/types'
import type { AppointmentVideoCallRole } from '@/features/appointments/utils/appointment-video-call-peer'

import { getAppointmentChatPeerUserId } from '@/features/appointments/utils/appointment-video-call-peer'
import { chatApi } from '@/features/chat/api/chat.api'
import { useTelehealthCallStore } from '@/stores/telehealthCall.store'

const CHAT_ROUTE_BY_ROLE: Record<AppointmentVideoCallRole, string> = {
  doctor: '/doctor/chat/$conversationId',
  patient: '/patient/chat/$conversationId',
}

/**
 * Từ lịch hẹn online -> lấy conversation với đối phương -> pending + navigate ?startVideo=true.
 */
export function useStartVideoCallFromAppointment(
  role: AppointmentVideoCallRole,
) {
  const navigate = useNavigate()
  const [isStartingVideoCall, setIsStartingVideoCall] = useState(false)

  const startVideoCallFromAppointment = useCallback(
    async (appt: Appointment) => {
      const peerUserId = getAppointmentChatPeerUserId(appt, role)
      if (peerUserId == null) {
        toast.error(
          role === 'doctor'
            ? 'Không xác định được tài khoản bệnh nhân.'
            : 'Không xác định được tài khoản bác sĩ.',
        )
        return
      }

      setIsStartingVideoCall(true)
      try {
        const conversation = await chatApi.getConversationByUserIds(peerUserId)
        useTelehealthCallStore.getState().setPendingAppointmentForCall(appt)

        navigate({
          to: CHAT_ROUTE_BY_ROLE[role],
          params: { conversationId: conversation.id },
          search: { startVideo: true },
        })
      } catch {
        toast.error(
          'Chưa có hoặc không tải được cuộc trò chuyện. Hãy mở Chat và nhắn trước.',
        )
      } finally {
        setIsStartingVideoCall(false)
      }
    },
    [navigate, role],
  )

  return { startVideoCallFromAppointment, isStartingVideoCall }
}
