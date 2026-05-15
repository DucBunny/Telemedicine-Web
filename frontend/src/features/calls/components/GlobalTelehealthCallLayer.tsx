import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { CallIncomingPayload } from '@/sockets/socket.types'

import { callApi } from '@/features/calls/api/call.api'
import { IncomingCallDialog } from '@/features/calls/components/IncomingCallDialog'
import { TelehealthVideoCallDialog } from '@/features/calls/components/TelehealthVideoCallDialog'
import { loadVisitAppointmentForCall } from '@/features/calls/utils/load-visit-appointment-for-call'
import { useGetConversationDetail } from '@/features/chat/hooks/useChatQueries'
import { selectUser, useAuthStore } from '@/stores/auth.store'
import {
  addCallIncomingListener,
  addCallPeerEndedListener,
  addCallPeerRejectedListener,
  useSystemSocketStore,
} from '@/stores/systemSocket.store'
import { useTelehealthCallStore } from '@/stores/telehealthCall.store'

export function GlobalTelehealthCallLayer() {
  const currentUser = useAuthStore(selectUser)

  const [incoming, setIncoming] = useState<CallIncomingPayload | null>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [callConversationId, setCallConversationId] = useState<string | null>(
    null,
  )
  const [activeCallLogId, setActiveCallLogId] = useState<number | null>(null)
  const [zegoMountVersion, setZegoMountVersion] = useState(0)

  const activeVisitAppointment = useTelehealthCallStore(
    (s) => s.activeVisitAppointment,
  )

  const incomingRef = useRef(incoming)
  incomingRef.current = incoming

  const callConversationIdRef = useRef(callConversationId)
  callConversationIdRef.current = callConversationId

  const videoOpenRef = useRef(false)
  const skipTelehealthEndEmitRef = useRef(false)
  const callEndSentRef = useRef(false)
  const activeCallLogIdRef = useRef<number | null>(null)

  useEffect(() => {
    activeCallLogIdRef.current = activeCallLogId
  }, [activeCallLogId])

  const conversationIdForDetail =
    incoming?.conversationId ?? callConversationId ?? ''

  const { data: conversationDetail } = useGetConversationDetail(
    conversationIdForDetail,
  )

  useEffect(() => {
    videoOpenRef.current = videoOpen
  }, [videoOpen])

  const markSkipNextTelehealthEndEmit = () => {
    skipTelehealthEndEmitRef.current = true
    queueMicrotask(() => {
      skipTelehealthEndEmitRef.current = false
    })
  }

  const handleCallSessionFinalize = (durationSeconds: number) => {
    const convId = callConversationIdRef.current
    if (!convId) return
    if (skipTelehealthEndEmitRef.current) return
    if (callEndSentRef.current) return

    const id = activeCallLogIdRef.current
    if (id == null) return

    callEndSentRef.current = true
    useSystemSocketStore.getState().emitCallEnd(convId, id, durationSeconds)
  }

  const handleVideoOpenChange = (open: boolean) => {
    const convId = callConversationIdRef.current

    if (!open) {
      if (
        convId &&
        !skipTelehealthEndEmitRef.current &&
        !callEndSentRef.current
      ) {
        const id = activeCallLogIdRef.current
        if (id != null) {
          callEndSentRef.current = true
          useSystemSocketStore.getState().emitCallEnd(convId, id, 0)
        }
      }

      setVideoOpen(false)
      setCallConversationId(null)
      setActiveCallLogId(null)
      useTelehealthCallStore.getState().setActiveVisitAppointment(null)
    } else {
      setVideoOpen(true)
    }
  }

  useEffect(() => {
    if (!currentUser) return
    if (currentUser.role !== 'doctor' && currentUser.role !== 'patient') return

    const unsubIn = addCallIncomingListener((p) => {
      if (Number(p.initiatorUserId) === Number(currentUser.id)) return
      if (videoOpenRef.current) return
      setIncoming(p)
    })

    const unsubDeclined = addCallPeerRejectedListener((p) => {
      const inc = incomingRef.current
      if (inc?.conversationId === p.conversationId) setIncoming(null)

      const cc = callConversationIdRef.current
      if (cc === p.conversationId && videoOpenRef.current) {
        markSkipNextTelehealthEndEmit()
        setVideoOpen(false)
        setCallConversationId(null)
        setActiveCallLogId(null)
        useTelehealthCallStore.getState().setActiveVisitAppointment(null)
        toast.message('Đối phương đã từ chối cuộc gọi.')
      }
    })

    const unsubEnded = addCallPeerEndedListener((p) => {
      const inc = incomingRef.current
      if (inc?.conversationId === p.conversationId) setIncoming(null)

      const cc = callConversationIdRef.current
      if (cc === p.conversationId && videoOpenRef.current) {
        markSkipNextTelehealthEndEmit()
        setVideoOpen(false)
        setCallConversationId(null)
        setActiveCallLogId(null)
        useTelehealthCallStore.getState().setActiveVisitAppointment(null)
        toast.message('Cuộc gọi đã kết thúc.')
      }
    })

    return () => {
      unsubIn()
      unsubDeclined()
      unsubEnded()
    }
  }, [currentUser?.id, currentUser?.role])

  if (!currentUser) return null
  if (currentUser.role !== 'doctor' && currentUser.role !== 'patient')
    return null

  return (
    <>
      <IncomingCallDialog
        open={incoming !== null}
        callerName={conversationDetail?.user.fullName ?? 'Người liên hệ'}
        callerAvatar={conversationDetail?.user.avatar}
        onAccept={async () => {
          if (!incoming) return

          const id = incoming.conversationId
          const logId = incoming.callLogId
          callEndSentRef.current = false

          try {
            await callApi.acceptCall(id, logId)
            useSystemSocketStore.getState().emitCallAccept(id, logId)
          } catch {
            toast.error('Không thể chấp nhận cuộc gọi. Thử lại.')
            return
          }

          if (incoming.appointmentId != null) {
            try {
              await loadVisitAppointmentForCall(incoming.appointmentId)
            } catch {
              useTelehealthCallStore.getState().setActiveVisitAppointment(null)
              toast.message('Không tải được thông tin lịch khám.')
            }
          } else {
            useTelehealthCallStore.getState().setActiveVisitAppointment(null)
          }

          setIncoming(null)
          setZegoMountVersion((v) => v + 1)
          setActiveCallLogId(logId)
          setCallConversationId(id)
          setVideoOpen(true)
        }}
        onDecline={() => {
          if (incoming) {
            useSystemSocketStore
              .getState()
              .emitCallReject(incoming.conversationId, incoming.callLogId)
          }
          setIncoming(null)
        }}
      />

      <TelehealthVideoCallDialog
        open={videoOpen}
        onOpenChange={handleVideoOpenChange}
        conversationId={callConversationId ?? ''}
        peerUser={conversationDetail?.user}
        zegoCallLogId={activeCallLogId ?? undefined}
        zegoMountVersion={zegoMountVersion}
        onCallSessionFinalize={handleCallSessionFinalize}
        visitContextAppointment={activeVisitAppointment}
      />
    </>
  )
}
