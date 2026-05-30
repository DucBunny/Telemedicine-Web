import cron from 'node-cron'
import {
  ackBufferedEcgRawPackets,
  claimBufferedEcgRawPackets,
} from '@/cache/ecgRaw.cache'
import { env } from '@/config'
import * as ecgRawRepo from '@/repositories/ecgRaw.repo'

/**
 * Flush buffered ECG raw packets from Redis to MongoDB
 */
export const flushBufferedEcgRawPackets = async () => {
  let insertedCount = 0

  while (true) {
    const packets = await claimBufferedEcgRawPackets(
      env.ECG_RAW_FLUSH_BATCH_SIZE,
    )
    if (!packets.length) break

    await ecgRawRepo.insertMany(packets)
    // Xóa list processing sau khi insert thành công
    await ackBufferedEcgRawPackets()
    // Cập nhật số lượng packet đã insert
    insertedCount += packets.length

    // Nếu số lượng packet trong batch nhỏ hơn batchSize, thì break
    if (packets.length < env.ECG_RAW_FLUSH_BATCH_SIZE) break
  }

  return insertedCount
}

/**
 * Cron job flushes ECG raw buffer every 5 seconds
 */
export const scheduleEcgRawFlushJob = () => {
  const expr = env.ECG_RAW_FLUSH_CRON
  if (!cron.validate(expr)) {
    console.warn(
      `[Cron Job] Invalid ECG_RAW_FLUSH_CRON "${expr}", skipping scheduler`,
    )
    return
  }

  cron.schedule(expr, async () => {
    try {
      const insertedCount = await flushBufferedEcgRawPackets()
      if (insertedCount > 0)
        console.log(
          `[Cron Job] Flushed ${insertedCount} ECG raw packet(s) to MongoDB`,
        )
    } catch (error) {
      console.error('[Cron Job] flushBufferedEcgRawPackets failed:', error)
    }
  })

  console.log(`[Cron Job] ECG raw flush scheduled (${expr})`)
}
