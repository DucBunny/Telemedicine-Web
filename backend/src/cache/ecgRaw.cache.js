import { redis } from '@/config'

// Key để lưu trữ ECG raw packets chưa được xử lý
const ECG_RAW_PENDING_KEY = 'telemetry:ecg-raw:pending'

// Key để lưu trữ ECG raw packets đang được xử lý
const ECG_RAW_PROCESSING_KEY = 'telemetry:ecg-raw:processing'

const parseBufferedPacket = (raw) => JSON.parse(raw)

/**
 * Push ECG raw packet vào Redis buffer
 * - Nhận một packet ECG raw dạng object.
 * - JSON.stringify() rồi LPUSH vào list pending.
 * - Dùng LPUSH nghĩa là packet mới được thêm vào đầu list (bên trái).
 */
export const enqueueEcgRawPacket = async (packet) => {
  await redis.lpush(ECG_RAW_PENDING_KEY, JSON.stringify(packet))
}

/**
 * Claim a batch for Mongo flush
 * - Mỗi lần claim, lấy tối đa batchSize packet từ list pending và chuyển sang list processing.
 * - Nếu batch trước đó bị crash ở giữa, retry lại trước khi claim item mới.
 */
export const claimBufferedEcgRawPackets = async (batchSize) => {
  // Lấy số lượng ECG raw packets đang được xử lý
  const processingCount = await redis.llen(ECG_RAW_PROCESSING_KEY)
  // Nếu có packet đang được xử lý, lấy tất cả packet đó và đảo ngược và parse thành object
  if (processingCount > 0) {
    const rawPackets = await redis.lrange(ECG_RAW_PROCESSING_KEY, 0, -1) // Lấy tất cả ECG raw packets đang được xử lý
    return rawPackets.reverse().map(parseBufferedPacket) // Trả lại thứ tự xử lý ban đầu
  }

  const claimedPackets = []
  for (let i = 0; i < batchSize; i += 1) {
    // Lấy packet mới nhất từ list pending và chuyển sang list processing
    const rawPacket = await redis.rpoplpush(
      ECG_RAW_PENDING_KEY,
      ECG_RAW_PROCESSING_KEY,
    )

    if (!rawPacket) break
    claimedPackets.push(parseBufferedPacket(rawPacket))
  }

  return claimedPackets
}

/**
 * Ack the batch after Mongo insert succeeds
 */
export const ackBufferedEcgRawPackets = async () => {
  await redis.del(ECG_RAW_PROCESSING_KEY)
}
