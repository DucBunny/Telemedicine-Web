import axios from 'axios'
import { env } from '@/config'

/**
 * Call ECG AI service with exactly SEQ_LEN raw MQTT packets (187 samples each).
 */
export const predictEcgPackets = async (packets) => {
  const url = `${env.ECG_INFERENCE_URL.replace(/\/$/, '')}/predict`
  // Auto-detect: match inference service _scale_to_unit logic
  // If any value > 1.5 or < -0.05, treat as raw uint8 (0-255)
  const isNormalized = packets.every((p) =>
    p.every((v) => v >= -0.05 && v <= 1.5),
  )

  const { data } = await axios.post(
    url,
    {
      packets,
      normalized: isNormalized,
    },
    {
      timeout: env.ECG_INFERENCE_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' },
    },
  )

  return {
    classInference: String(data.class ?? data.class_name ?? 'N').toUpperCase(),
    classIndex: Number(data.class_index),
    confidence: Number(data.confidence),
    latencyMs: Number(data.latency_ms),
    preprocessMs: Number(data.preprocess_ms),
    inferenceMs: Number(data.inference_ms),
    probabilities: data.probabilities ?? {},
  }
}
