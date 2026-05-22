import { useCallback, useEffect, useRef } from 'react'

import type { Alert } from '@/features/alerts/types'
import type { Appointment } from '@/features/appointments/types'
import type { ChatUser } from '@/features/chat/types'

import { DoctorAlertRecordPanel } from '@/features/calls/components/DoctorAlertRecordPanel'
import { DoctorVisitRecordPanel } from '@/features/calls/components/DoctorVisitRecordPanel'
import { PatientVisitInfoPanel } from '@/features/calls/components/PatientVisitInfoPanel'
import { ZegoPrebuiltCall } from '@/features/calls/components/ZegoPrebuiltCall'
import { useTelehealthAppointmentPanels } from '@/features/calls/hooks/useTelehealthAppointmentPanels'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { selectUser, useAuthStore } from '@/stores/auth.store'

export interface TelehealthVideoCallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversationId: string
  peerUser: ChatUser | undefined
  zegoCallLogId?: number
  zegoMountVersion?: number
  onCallSessionFinalize?: (durationSeconds: number) => void
  visitContextAppointment?: Appointment | null
  visitContextAlert?: Alert | null
  /** Bệnh nhân — cờ từ socket, chỉ hiện text tĩnh */
  visitFromAlert?: boolean
}

export function TelehealthVideoCallDialog({
  open,
  onOpenChange,
  conversationId,
  peerUser,
  zegoCallLogId,
  zegoMountVersion = 0,
  onCallSessionFinalize,
  visitContextAppointment = null,
  visitContextAlert = null,
  visitFromAlert = false,
}: TelehealthVideoCallDialogProps) {
  const currentUser = useAuthStore(selectUser)

  const showAppointmentPanel =
    open && !!visitContextAppointment && !!visitContextAppointment.id
  const showDoctorAlertPanel =
    open && !!visitContextAlert?.id && currentUser?.role === 'doctor'
  const showPatientAlertPanel =
    open && visitFromAlert && currentUser?.role === 'patient'
  const showVisitSidePanel =
    showAppointmentPanel || showDoctorAlertPanel || showPatientAlertPanel

  const { appointment, existingRecord, isLoading } =
    useTelehealthAppointmentPanels({
      appointment: showAppointmentPanel ? visitContextAppointment : null,
      peerUserId: peerUser?.id,
      role: currentUser?.role,
      enabled: showAppointmentPanel && open,
    })

  const callJoinedAtMsRef = useRef(0)
  const sessionFinalizedRef = useRef(false)

  const peerId = peerUser?.id ?? 0
  const zegoReady =
    open &&
    !!conversationId &&
    !!currentUser &&
    !!peerUser &&
    zegoCallLogId != null &&
    Number.isFinite(zegoCallLogId)

  useEffect(() => {
    if (!open) {
      callJoinedAtMsRef.current = 0
      sessionFinalizedRef.current = false
      return
    }
    if (zegoReady) callJoinedAtMsRef.current = Date.now()
  }, [open, zegoReady, zegoCallLogId, zegoMountVersion])

  const getElapsedDurationSeconds = useCallback(() => {
    const start = callJoinedAtMsRef.current
    return start > 0 ? Math.max(0, Math.floor((Date.now() - start) / 1000)) : 0
  }, [])

  const finalizeSessionOnce = useCallback(
    (durationSeconds: number) => {
      if (sessionFinalizedRef.current) return
      sessionFinalizedRef.current = true
      onCallSessionFinalize?.(durationSeconds)
    },
    [onCallSessionFinalize],
  )

  const handleDialogOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && open) {
        finalizeSessionOnce(getElapsedDurationSeconds())
      }
      onOpenChange(nextOpen)
    },
    [open, onOpenChange, finalizeSessionOnce, getElapsedDurationSeconds],
  )

  const handleZegoLeave = useCallback(
    (durationSeconds: number) => {
      finalizeSessionOnce(durationSeconds)
      onOpenChange(false)
    },
    [finalizeSessionOnce, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton
        className="data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 top-0 left-0 z-90 h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 bg-white p-0 shadow-xl sm:max-w-none">
        <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
          <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col border-slate-200 md:h-full md:border-r md:border-b-0">
            <DialogHeader className="border-border z-10 shrink-0 border-b bg-white px-4 py-3 text-left">
              <DialogTitle>Gọi video</DialogTitle>
              <DialogDescription className="truncate">
                {peerUser?.fullName
                  ? `Đang gọi với ${peerUser.fullName}`
                  : 'Cuộc gọi 1-1'}
              </DialogDescription>
            </DialogHeader>

            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-black">
              {zegoReady ? (
                <ZegoPrebuiltCall
                  key={`${conversationId}-${currentUser.id}-${zegoCallLogId}-${zegoMountVersion}`}
                  conversationId={conversationId}
                  callLogId={zegoCallLogId}
                  mountVersion={zegoMountVersion}
                  onLeaveRoom={handleZegoLeave}
                />
              ) : (
                <div className="flex min-h-0 flex-1 items-center justify-center bg-black px-4 text-center text-sm text-white/70">
                  {!currentUser || !peerUser
                    ? 'Không tải được thông tin người dùng.'
                    : zegoCallLogId == null
                      ? 'Thiếu thông tin cuộc gọi (callLogId).'
                      : 'Đang chuẩn bị phòng...'}
                </div>
              )}
            </div>
          </div>

          {showVisitSidePanel ? (
            <aside className="max-h-dvh w-full shrink-0 overflow-y-auto border-t border-slate-200 bg-white md:w-[min(100%,420px)] md:max-w-[40vw] md:border-t-0 md:border-l">
              <div className="p-4">
                {showDoctorAlertPanel ? (
                  <DoctorAlertRecordPanel alert={visitContextAlert} />
                ) : showPatientAlertPanel ? (
                  <div className="space-y-2 bg-white">
                    <p className="text-lg font-semibold text-slate-800">
                      Theo dõi sức khỏe
                    </p>
                    <p className="text-sm leading-relaxed text-slate-700">
                      Bác sĩ {peerUser?.fullName ?? 'của bạn'} đang trò chuyện
                      và theo dõi các chỉ số bạn đã chia sẻ từ thiết bị. Bạn có
                      thể hỏi thêm nếu cần.
                    </p>
                  </div>
                ) : isLoading ? (
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Đang tải lịch…
                    </p>
                  </div>
                ) : currentUser?.role === 'doctor' ? (
                  <DoctorVisitRecordPanel
                    appointment={appointment}
                    patientUserId={peerId}
                    existingRecord={existingRecord}
                  />
                ) : (
                  <PatientVisitInfoPanel
                    appointment={appointment}
                    doctorName={peerUser?.fullName}
                  />
                )}
              </div>
            </aside>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
