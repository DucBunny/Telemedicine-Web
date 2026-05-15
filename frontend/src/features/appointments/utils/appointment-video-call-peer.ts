import type { Appointment } from '@/features/appointments/types'

export type AppointmentVideoCallRole = 'doctor' | 'patient'

/**
 * Lấy userId đối phương trong chat 1-1 (bác sĩ <-> bệnh nhân) từ appointment
 */
export function getAppointmentChatPeerUserId(
  appt: Appointment,
  role: AppointmentVideoCallRole,
): number | null {
  if (role === 'doctor') {
    const id = appt.patientId
    return Number.isFinite(Number(id)) ? Number(id) : null
  }

  const id = appt.doctorId
  return Number.isFinite(Number(id)) ? Number(id) : null
}

/**
 * Kiểm tra lịch hẹn từ bảng/card có khớp người trong conversation đang mở không.
 */
export function appointmentMatchesChatPeer(
  appt: Appointment,
  peerUserId: number,
  role: AppointmentVideoCallRole,
): boolean {
  const expected = getAppointmentChatPeerUserId(appt, role)
  return expected != null && expected === Number(peerUserId)
}
