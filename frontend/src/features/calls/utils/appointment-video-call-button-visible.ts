/** Hiện nút gọi video: từ 15 phút trước scheduledAt đến hết slot (scheduledAt + duration). */
const APPOINTMENT_VIDEO_EARLY_MS = 15 * 60 * 1000

/**
 * Kiểm tra nút gọi video có thể hiển thị không
 * @param scheduledAt - Thời gian bắt đầu khám
 * @param durationMinutes - Thời gian khám
 * @returns true nếu nút gọi video có thể hiển thị, false nếu không
 */
export function isAppointmentVideoCallButtonVisible(
  scheduledAt: string,
  durationMinutes: number,
): boolean {
  const start = new Date(scheduledAt).getTime()

  if (Number.isNaN(start)) return false

  const end = start + Math.max(1, durationMinutes) * 60 * 1000
  const now = Date.now()

  return now >= start - APPOINTMENT_VIDEO_EARLY_MS && now <= end
}
