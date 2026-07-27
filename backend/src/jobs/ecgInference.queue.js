import { Queue, Worker } from 'bullmq'
import { appendSlidingPacket } from '@/cache/ecgBeatBuffer.cache'
import { enqueueEcgRawPacket } from '@/cache/ecgRaw.cache'
import { env, redis } from '@/config'
import { predictEcgPackets } from '@/services/ecgInference.client'
import {
  handleAbnormalInference,
  handleNormalInference,
  handleWarmupPacket,
} from '@/services/telemetry.service'

// Queue name và job name
const ECG_INFERENCE_QUEUE = 'health.ecg-inference.queue'
const ECG_INFERENCE_JOB = 'process-packet'

// Options cho job inference ECG
const INFERENCE_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential', // Giảm tốc độ backoff sau mỗi lần thử
    delay: 500,
  },
  removeOnComplete: 1000, // Xóa job sau khi hoàn thành (1000 job)
  removeOnFail: 200, // Xóa job sau khi thất bại (200 job)
}

// Kết nối Redis cho queue và worker
const queueConnection = redis.duplicate()
const workerConnection = redis.duplicate()

// Tạo queue và worker
const ecgInferenceQueue = new Queue(ECG_INFERENCE_QUEUE, {
  connection: queueConnection,
})

let ecgInferenceWorker

const buildEcgRawDocument = ({
  ctx,
  packetEcg,
  timestamp,
  inferenceReady,
  classInference = null,
  latencyMs = null,
  confidence = null,
}) => ({
  timestamp,
  metadata: {
    patient_id: ctx.patientId,
    device_id: ctx.deviceId,
  },
  ecg_packet: packetEcg,
  class_inference: classInference,
  inference_ready: inferenceReady,
  inference_latency_ms: latencyMs,
  inference_confidence: confidence,
  is_abnormal:
    inferenceReady && classInference != null && classInference !== 'N',
})

// Xử lý gói ECG
const processEcgPacket = async (job) => {
  const { deviceId, patientId, packetEcg, timestampMs } = job.data
  const ctx = { deviceId, patientId }
  const timestamp = new Date(timestampMs || Date.now())
  const sliding = await appendSlidingPacket(deviceId, packetEcg, timestampMs)

  const isWarmup = sliding.beatCount < env.ECG_SEQ_LEN

  if (isWarmup) {
    // Warmup packet (chưa đủ độ dài cửa sổ trượt)
    const doc = buildEcgRawDocument({
      ctx,
      packetEcg,
      timestamp,
      inferenceReady: false,
    })
    await enqueueEcgRawPacket(doc)
    await handleWarmupPacket(ctx, {
      packetEcg,
      timestamp,
      beatCount: sliding.beatCount,
    })
    return { status: 'warmup', beatCount: sliding.beatCount }
  }

  // Kiểm tra xem có đủ độ dài cửa sổ trượt không
  if (sliding.packets.length < env.ECG_SEQ_LEN)
    throw new Error(
      `Sliding window incomplete: ${sliding.packets.length}/${env.ECG_SEQ_LEN}`,
    )

  // Nếu đủ độ dài cửa sổ trượt, predict ECG
  let inference
  try {
    inference = await predictEcgPackets(sliding.packets)
  } catch (error) {
    const doc = buildEcgRawDocument({
      ctx,
      packetEcg,
      timestamp,
      inferenceReady: false,
    })
    // Enqueue ECG raw packet và handle warmup packet
    await enqueueEcgRawPacket(doc)
    await handleWarmupPacket(ctx, {
      packetEcg,
      timestamp,
      beatCount: sliding.beatCount,
      inferenceError: error.message,
    })
    return {
      status: 'inference_failed',
      beatCount: sliding.beatCount,
      error: error.message,
    }
  }

  const doc = buildEcgRawDocument({
    ctx,
    packetEcg,
    timestamp,
    inferenceReady: true,
    classInference: inference.classInference,
    latencyMs: inference.latencyMs,
    confidence: inference.confidence,
  })
  await enqueueEcgRawPacket(doc)

  // Gửi gói ECG đến monitor và xử lý alert
  const socketPayload = {
    packetEcg,
    classInference: inference.classInference,
    timeInference: inference.latencyMs,
    inferenceReady: true,
    inferenceConfidence: inference.confidence,
    timestamp,
  }

  if (inference.classInference !== 'N' && inference.confidence > 0.7) {
    await handleAbnormalInference(ctx, socketPayload, inference.classInference)
  } else {
    await handleNormalInference(ctx, socketPayload)
  }

  return {
    status: 'inferred',
    beatCount: sliding.beatCount,
    class: inference.classInference,
    latencyMs: inference.latencyMs,
    confidence: inference.confidence,
  }
}

/**
 * Enqueue a new ECG inference job.
 */
export const enqueueEcgInferenceJob = async ({
  deviceId,
  patientId,
  packetEcg,
  timestampMs,
}) => {
  await ecgInferenceQueue.add(
    ECG_INFERENCE_JOB,
    { deviceId, patientId, packetEcg, timestampMs },
    INFERENCE_JOB_OPTIONS,
  )
}

/**
 * Start the ECG inference worker.
 */
export const startEcgInferenceWorker = async () => {
  if (ecgInferenceWorker) return ecgInferenceWorker

  ecgInferenceWorker = new Worker(
    ECG_INFERENCE_QUEUE,
    async (job) => processEcgPacket(job),
    {
      connection: workerConnection,
      concurrency: env.ECG_INFERENCE_WORKER_CONCURRENCY,
    },
  )

  ecgInferenceWorker.on('failed', (job, error) => {
    console.error(
      `[BullMQ] ECG inference job failed (device=${job?.data?.deviceId}):`,
      error?.message || error,
    )
  })

  console.log(
    `[BullMQ] ECG inference worker started (${ECG_INFERENCE_QUEUE}, concurrency=${env.ECG_INFERENCE_WORKER_CONCURRENCY})`,
  )

  return ecgInferenceWorker
}
