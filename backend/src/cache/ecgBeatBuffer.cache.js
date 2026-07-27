import { env, redis } from '@/config'

const slidingKey = (deviceId) => `telemetry:ecg-sliding:${deviceId}`

/**
 * Phân tích trạng thái cửa sổ trượt từ Redis.
 */
const parseState = (raw) => {
  // Nếu không có dữ liệu, trả về trạng thái mặc định
  if (!raw) return { packets: [], beatCount: 0, lastPacketAt: 0 }

  try {
    const parsed = JSON.parse(raw)
    return {
      packets: Array.isArray(parsed.packets) ? parsed.packets : [],
      beatCount: Number(parsed.beatCount) || 0,
      lastPacketAt: Number(parsed.lastPacketAt) || 0,
    }
  } catch {
    return { packets: [], beatCount: 0, lastPacketAt: 0 }
  }
}

/**
 * Thêm một gói ECG raw vào cửa sổ trượt per-device.
 */
export const appendSlidingPacket = async (deviceId, packetEcg, packetAtMs) => {
  const seqLen = env.ECG_SEQ_LEN // Kích thước cửa sổ trượt
  const gapMs = env.ECG_SESSION_GAP_MS // Thời gian giữa 2 session ECG
  const key = slidingKey(deviceId)
  const current = parseState(await redis.get(key))

  // Kiểm tra xem có cần reset cửa sổ trượt không
  const shouldReset =
    current.lastPacketAt > 0 &&
    Number.isFinite(packetAtMs) &&
    packetAtMs - current.lastPacketAt > gapMs

  // Cập nhật cửa sổ trượt
  const base = shouldReset
    ? { packets: [], beatCount: 0, lastPacketAt: 0 }
    : current

  const packets = [...base.packets, packetEcg].slice(-seqLen)
  const beatCount = base.beatCount + 1
  const next = {
    packets,
    beatCount,
    lastPacketAt: packetAtMs || Date.now(),
  }

  await redis.set(
    key,
    JSON.stringify(next),
    'EX',
    env.ECG_SLIDING_STATE_TTL_SEC,
  )
  return next
}

/**
 * Reset cửa sổ trượt cho device ID.
 */
export const resetSlidingState = async (deviceId) => {
  await redis.del(slidingKey(deviceId))
}
