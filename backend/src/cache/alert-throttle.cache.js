import { redis } from '@/config'

/**
 * Cache Alert Throttle (Chống tạo alert/email trùng lặp trong TTL) tránh spam alert/email
 */

export const ALERT_THROTTLE_TTL_SEC = 30 * 60 // 30 minutes

const throttleKey = (patientId, alertType) =>
  `alert:throttle:${patientId}:${alertType}`

/**
 * Lấy alertId đang được throttle (nếu còn trong cửa sổ TTL)
 */
export const getThrottledAlertId = async (patientId, alertType) => {
  const raw = await redis.get(throttleKey(patientId, alertType))
  return raw ? parseInt(raw, 10) : null
}

/**
 * Gắn alertId vào Redis — chống tạo alert/email trùng trong TTL
 */
export const setThrottledAlertId = async (
  patientId,
  alertType,
  alertId,
  ttlSec = ALERT_THROTTLE_TTL_SEC,
) => {
  await redis.setex(throttleKey(patientId, alertType), ttlSec, String(alertId))
}

/**
 * Xóa throttle khi cảnh báo đã xử lý xong — cho phép tạo alert mới nếu tái phát
 */
export const clearThrottledAlertId = async (patientId, alertType) => {
  await redis.del(throttleKey(patientId, alertType))
}

/**
 * Reset TTL của alert throttle (khi có bất thường mới)
 * Đảm bảo tạo alert mới chỉ khi đã 30 phút kể từ last_detected_at
 */
export const refreshThrottleTTL = async (
  patientId,
  alertType,
  ttlSec = ALERT_THROTTLE_TTL_SEC,
) => {
  const key = throttleKey(patientId, alertType)
  const exists = await redis.exists(key)
  if (exists) {
    await redis.expire(key, ttlSec)
  }
}
