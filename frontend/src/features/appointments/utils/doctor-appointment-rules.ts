const APPOINTMENT_CONFIRM_LOCK_MINUTES_BEFORE = 15
const APPOINTMENT_DOCTOR_STATUS_EDIT_MIN_HOURS_AFTER_END = 0
const APPOINTMENT_DOCTOR_STATUS_EDIT_MAX_HOURS_AFTER_END = 48

/**
 * Kiểm tra có thể xác nhận lịch hẹn không
 * @param scheduledAt - Thời gian khám
 * @returns true nếu có thể xác nhận lịch hẹn, false nếu không
 */
export function isAppointmentConfirmLockedByTime(scheduledAt: string) {
  const startMs = new Date(scheduledAt).getTime()
  const now = Date.now()

  if (Number.isNaN(startMs)) return true

  if (startMs <= now) return true

  return startMs - now < APPOINTMENT_CONFIRM_LOCK_MINUTES_BEFORE * 60 * 1000
}

/**
 * Kiểm tra có thể đổi trạng thái lịch hẹn không
 * @param appointment - Thông tin lịch hẹn
 * @param minHoursAfterEnd - Số giờ sau khi kết thúc ca khám
 * @param maxHoursAfterEnd - Số giờ sau khi kết thúc ca khám
 * @returns true nếu có thể đổi trạng thái lịch hẹn, false nếu không
 */
export function canDoctorPatchAppointmentStatus(
  appointment: {
    status: string
    scheduledAt: string
    durationMinutes: number
  },
  minHoursAfterEnd: number = APPOINTMENT_DOCTOR_STATUS_EDIT_MIN_HOURS_AFTER_END,
  maxHoursAfterEnd: number = APPOINTMENT_DOCTOR_STATUS_EDIT_MAX_HOURS_AFTER_END,
) {
  if (!['confirmed', 'cancelled'].includes(appointment.status)) return false
  const visitEndMs = new Date(appointment.scheduledAt).getTime()

  if (Number.isNaN(visitEndMs)) return false

  const now = Date.now()
  const minMs = visitEndMs + minHoursAfterEnd * 3600000
  const maxMs = visitEndMs + maxHoursAfterEnd * 3600000

  return now >= minMs && now <= maxMs
}
