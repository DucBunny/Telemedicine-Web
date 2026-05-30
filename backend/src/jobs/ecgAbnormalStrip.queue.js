import { Queue, QueueEvents, Worker } from 'bullmq'
import { env, redis } from '@/config'
import * as alertRepo from '@/repositories/alert.repo'
import * as ecgAbnormalStripRepo from '@/repositories/ecgAbnormalStrip.repo'
import * as ecgRawRepo from '@/repositories/ecgRaw.repo'

// Queue name và job name
const ECG_ABNORMAL_STRIP_QUEUE = 'health.alert-strip.queue'
const ECG_ABNORMAL_STRIP_JOB = 'persist-abnormal-strip'

const FLUSH_WAIT_TTL_MS = 60 * 1000 // Thời gian timeout tránh treo job quá lâu (1 phút)

// Thời gian window và duration của đoạn ECG
const ECG_STRIP_WINDOW_SEC = 5
const ECG_STRIP_DURATION_SEC = ECG_STRIP_WINDOW_SEC * 2

// Options cho job lưu trữ đoạn ECG abnormal strip
const STRIP_JOB_OPTIONS = {
  attempts: 5,
  backoff: {
    type: 'fixed',
    delay: 60 * 1000,
  },
  removeOnComplete: true,
  removeOnFail: 20,
}

// Kết nối Redis cho queue và worker
const queueConnection = redis.duplicate()
const workerConnection = redis.duplicate()
const queueEventsConnection = redis.duplicate()

// Tạo queue và worker
const ecgAbnormalStripQueue = new Queue(ECG_ABNORMAL_STRIP_QUEUE, {
  connection: queueConnection,
})

let ecgAbnormalStripWorker
let ecgAbnormalStripQueueEvents
let stripQueueEventsReadyPromise

// Tạo job ID cho job lưu trữ đoạn ECG abnormal strip
export const getPersistAbnormalStripJobId = (alertId) => `alert-${alertId}`

// Tạo queue events cho queue
const getStripQueueEvents = () => {
  if (!ecgAbnormalStripQueueEvents) {
    ecgAbnormalStripQueueEvents = new QueueEvents(ECG_ABNORMAL_STRIP_QUEUE, {
      connection: queueEventsConnection,
    })
    stripQueueEventsReadyPromise = ecgAbnormalStripQueueEvents.waitUntilReady()
  }
  return ecgAbnormalStripQueueEvents
}

// Đảm bảo queue events đã sẵn sàng
const ensureStripQueueEventsReady = async () => {
  getStripQueueEvents()
  await stripQueueEventsReadyPromise
}

// Tính toán delay lưu strip
const computeStripPersistDelay = (alert) => {
  const referenceTime = new Date(
    alert.lastDetectedAt || alert.triggerTimestamp || Date.now(),
  )
  return Math.max(
    0,
    referenceTime.getTime() + env.ALERT_THROTTLE_TTL_SEC * 1000 - Date.now(),
  )
}

// Giải mã timestamp thành window start và end
const resolveStripWindow = (referenceTimestamp) => {
  const referenceTime = new Date(referenceTimestamp)

  return {
    referenceTime,
    windowStart: new Date(
      referenceTime.getTime() - ECG_STRIP_WINDOW_SEC * 1000,
    ),
    windowEnd: new Date(referenceTime.getTime() + ECG_STRIP_WINDOW_SEC * 1000),
  }
}

// Giải mã alert type thành class bất thường
const fallbackDetectedClass = (alertType) =>
  String(alertType || '')
    .replace(/^ecg_/, '')
    .toUpperCase()

// Flatten packets thành một mảng duy nhất
const flattenStripPackets = (packets) =>
  packets.flatMap((packet) =>
    Array.isArray(packet.ecg_packet) ? packet.ecg_packet : [],
  )

// Loại bỏ packet trùng timestamp (vd. nhiều backend cùng subscribe MQTT)
const dedupePacketsByTimestamp = (packets) => {
  const byTimestamp = new Map()

  for (const packet of packets) {
    const timestampMs = new Date(packet.timestamp).getTime()
    if (!Number.isFinite(timestampMs)) continue
    if (!byTimestamp.has(timestampMs)) byTimestamp.set(timestampMs, packet)
  }

  return [...byTimestamp.values()].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
}

// Lấy các class bất thường từ packets
const extractDetectedClasses = (packets, alertType) => {
  const classes = [
    ...new Set(
      packets
        .map((packet) => String(packet.class_inference || '').toUpperCase())
        .filter((className) => ['S', 'V', 'F', 'Q'].includes(className)),
    ),
  ]

  if (classes.length > 0) return classes

  // Nếu không có class bất thường, fallback về class bất thường từ alert type
  const fallbackClass = fallbackDetectedClass(alertType)
  return ['S', 'V', 'F', 'Q'].includes(fallbackClass) ? [fallbackClass] : []
}

// Xây dựng document ECG abnormal strip
const buildStripDocument = async ({
  alertId,
  patientId,
  alertType,
  stripType,
  referenceTimestamp,
  label,
}) => {
  // Giải mã timestamp thành window start và end
  const { referenceTime, windowStart, windowEnd } =
    resolveStripWindow(referenceTimestamp)

  // Lấy các packets ECG raw trong window
  const rawPackets = await ecgRawRepo.findByPatientIdAndTimeRange(
    patientId,
    windowStart,
    windowEnd,
  )

  const uniquePackets = dedupePacketsByTimestamp(rawPackets)

  if (rawPackets.length !== uniquePackets.length) {
    console.warn(
      `[BullMQ] Deduped ECG packets for alert ${alertId} (${label}): ${rawPackets.length} → ${uniquePackets.length} (check for multiple backend instances on same MQTT)`,
    )
  }

  if (!uniquePackets.length)
    throw new Error(
      `No ECG raw packets found for alert ${alertId} around ${label} window`,
    )

  const ecgData = flattenStripPackets(uniquePackets)
  if (!ecgData.length)
    throw new Error(
      `Flattened ECG strip is empty for alert ${alertId} (${label})`,
    )

  return {
    patient_id: patientId,
    alert_id: alertId,
    strip_type: stripType,
    reference_timestamp: referenceTime,
    window_start: windowStart,
    window_end: windowEnd,
    duration_seconds: ECG_STRIP_DURATION_SEC,
    ecg_data: ecgData,
    detected_classes: extractDetectedClasses(uniquePackets, alertType),
  }
}

// Kiểm tra xem có nên lưu trữ đoạn ECG abnormal strip last_detected không
const shouldPersistLastDetectedStrip = (alert) => {
  if (!alert?.lastDetectedAt || !alert?.triggerTimestamp) return false

  const lastMs = new Date(alert.lastDetectedAt).getTime()
  const triggerMs = new Date(alert.triggerTimestamp).getTime()

  return (
    Number.isFinite(lastMs) && Number.isFinite(triggerMs) && lastMs > triggerMs
  )
}

/**
 * Hủy job delay lưu strip (tránh lưu trùng khi reschedule / flush).
 */
export const cancelPersistAbnormalStripJob = async (
  alertId,
  { silent = false } = {},
) => {
  if (!alertId) return

  const jobId = getPersistAbnormalStripJobId(alertId)
  const existingJob = await ecgAbnormalStripQueue.getJob(jobId)
  if (!existingJob) return

  try {
    await existingJob.remove()
    if (!silent) {
      console.log(`[BullMQ] Cancelled delayed strip job ${jobId}`)
    }
  } catch (error) {
    console.warn(
      `[BullMQ] Failed to cancel delayed strip job for alert ${alertId}:`,
      error.message,
    )
  }
}

/**
 * Thay job cũ (nếu có) và enqueue persist strip.
 * @returns {Promise<import('bullmq').Job|null>}
 */
const enqueuePersistAbnormalStripJob = async (alertId, { delay }) => {
  if (!alertId) return null

  const jobId = getPersistAbnormalStripJobId(alertId)
  await cancelPersistAbnormalStripJob(alertId, { silent: true })

  // Thêm job vào queue
  const job = await ecgAbnormalStripQueue.add(
    ECG_ABNORMAL_STRIP_JOB,
    { alertId },
    {
      jobId,
      delay,
      ...STRIP_JOB_OPTIONS,
    },
  )

  console.log(
    `[BullMQ] Scheduled abnormal strip job ${jobId} for alert ${alertId} (delay ${Math.round(delay / 1000)}s)`,
  )

  return job
}

// Lưu trữ đoạn ECG abnormal strip
const persistAbnormalStrip = async ({ alertId }) => {
  const alert = await alertRepo.findById(alertId)
  if (!alert) {
    console.warn(
      `[BullMQ] Alert ${alertId} not found, skipping abnormal strip creation`,
    )
    return null
  }

  const savedStrips = []

  const [triggerResult, lastResult] = await Promise.allSettled([
    buildStripDocument({
      alertId: alert.id,
      patientId: alert.patientId,
      alertType: alert.type,
      stripType: 'trigger',
      referenceTimestamp: alert.triggerTimestamp,
      label: 'trigger',
    }),
    shouldPersistLastDetectedStrip(alert)
      ? buildStripDocument({
          alertId: alert.id,
          patientId: alert.patientId,
          alertType: alert.type,
          stripType: 'last_detected',
          referenceTimestamp: alert.lastDetectedAt,
          label: 'last_detected',
        })
      : Promise.resolve(null),
  ])

  // Xử lý trigger strip nếu có lỗi
  if (triggerResult.status === 'rejected') {
    console.error(
      `[BullMQ] Failed to persist trigger strip for alert ${alert.id}:`,
      triggerResult.reason?.message ?? triggerResult.reason,
    )
    throw triggerResult.reason
  }

  // Lưu trigger strip
  const triggerStrip = triggerResult.value
  const savedTriggerStrip = await ecgAbnormalStripRepo.upsertByAlertIdAndType(
    alert.id,
    'trigger',
    triggerStrip,
  )

  savedStrips.push(savedTriggerStrip)
  console.log(
    `[BullMQ] Saved trigger strip for alert ${alert.id} (${triggerStrip.ecg_data.length} samples)`,
  )

  // Kiểm tra xem có nên lưu trữ đoạn ECG abnormal strip last_detected không
  if (!shouldPersistLastDetectedStrip(alert)) {
    console.log(
      `[BullMQ] Skip last_detected strip for alert ${alert.id} (missing timestamp or same as trigger)`,
    )
    return savedStrips
  }

  // Lưu last_detected strip
  if (lastResult.status === 'fulfilled' && lastResult.value) {
    try {
      const savedLastDetectedStrip =
        await ecgAbnormalStripRepo.upsertByAlertIdAndType(
          alert.id,
          'last_detected',
          lastResult.value,
        )

      savedStrips.push(savedLastDetectedStrip)
      console.log(
        `[BullMQ] Saved last_detected strip for alert ${alert.id} (${lastResult.value.ecg_data.length} samples)`,
      )
    } catch (error) {
      const { windowStart, windowEnd } = resolveStripWindow(
        alert.lastDetectedAt,
      )
      console.warn(
        `[BullMQ] Could not persist last_detected strip for alert ${alert.id}: ${error.message}`,
        `(window ${windowStart.toISOString()} - ${windowEnd.toISOString()})`,
      )
    }
  } else {
    const reason =
      lastResult.status === 'rejected'
        ? (lastResult.reason?.message ?? lastResult.reason)
        : 'unknown'
    const { windowStart, windowEnd } = resolveStripWindow(alert.lastDetectedAt)
    console.warn(
      `[BullMQ] Could not persist last_detected strip for alert ${alert.id}: ${reason}`,
      `(window ${windowStart.toISOString()} - ${windowEnd.toISOString()})`,
    )
  }

  // Trả về các đoạn ECG abnormal strip đã lưu
  return savedStrips
}

/**
 * Lưu strip ngay qua queue (delay 0) — worker xử lý song song khi nhiều alert resolve cùng lúc.
 */
export const flushPersistAbnormalStripNow = async (alertId) => {
  if (!alertId) return null

  try {
    await ensureStripQueueEventsReady()

    const job = await enqueuePersistAbnormalStripJob(alertId, { delay: 0 })
    if (!job) return null

    return await job.waitUntilFinished(getStripQueueEvents(), FLUSH_WAIT_TTL_MS)
  } catch {
    return null
  }
}

/**
 * Delay strip persistence until the abnormal episode has been quiet for 30 minutes
 */
export const schedulePersistAbnormalStripJob = async (alert) => {
  if (!alert?.id) return

  await enqueuePersistAbnormalStripJob(alert.id, {
    delay: computeStripPersistDelay(alert),
  })
}

/**
 * Start BullMQ worker that persists abnormal ECG strips
 */
export const startEcgAbnormalStripWorker = async () => {
  if (ecgAbnormalStripWorker) return ecgAbnormalStripWorker

  await ensureStripQueueEventsReady()

  // Tạo worker
  ecgAbnormalStripWorker = new Worker(
    ECG_ABNORMAL_STRIP_QUEUE,
    async (job) => await persistAbnormalStrip(job.data),
    {
      connection: workerConnection,
      concurrency: 2, // Số lượng worker đồng thời
    },
  )

  ecgAbnormalStripWorker.on('failed', (job, error) => {
    console.error(
      `[BullMQ] Failed abnormal strip job ${job?.id} for alert ${job?.data?.alertId}:`,
      error,
    )
  })

  console.log(
    `[BullMQ] ECG abnormal strip worker started (${ECG_ABNORMAL_STRIP_QUEUE})`,
  )

  return ecgAbnormalStripWorker
}
