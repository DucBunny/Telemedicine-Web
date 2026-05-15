import { useCallback } from 'react'

import type { Appointment } from '@/features/appointments/types'
import type { ChatUser } from '@/features/chat/types'

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
}: TelehealthVideoCallDialogProps) {
  const currentUser = useAuthStore(selectUser)

  const showVisitSidePanel =
    open && !!visitContextAppointment && !!visitContextAppointment.id

  const { appointment, existingRecord, isLoading } =
    useTelehealthAppointmentPanels({
      appointment: showVisitSidePanel ? visitContextAppointment : null,
      peerUserId: peerUser?.id,
      role: currentUser?.role,
      enabled: showVisitSidePanel && open,
    })

  const handleZegoLeave = useCallback(
    (durationSeconds: number) => {
      onCallSessionFinalize?.(durationSeconds)
      onOpenChange(false)
    },
    [onCallSessionFinalize, onOpenChange],
  )

  const peerId = peerUser?.id ?? 0
  const zegoReady =
    open &&
    !!conversationId &&
    !!currentUser &&
    !!peerUser &&
    zegoCallLogId != null &&
    Number.isFinite(zegoCallLogId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                {isLoading ? (
                  <p className="text-muted-foreground text-sm">
                    Đang tải lịch…
                  </p>
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
