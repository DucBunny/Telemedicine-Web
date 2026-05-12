import axios from 'axios'
import { env } from '@/config'

/**
 * AI Service Client để gọi ML model prediction
 */
const aiClient = axios.create({
  baseURL: env.AI_SERVICE_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Gửi health data đến AI service để predict
 * @param {Object} healthData - Data từ ESP (bpm, spo2, hrv, ecg)
 * @returns {Promise<Object>} Prediction result
 */
export const predictHealthStatus = async (healthData) => {
  try {
    const { deviceId, bpm, spo2, hrv, ecgData } = healthData

    // Prepare data cho ML model
    const payload = {
      device_id: deviceId,
      metrics: {
        bpm,
        spo2,
        hrv,
      },
      ecg: ecgData || [],
    }

    console.log(`🤖 Sending to AI service for prediction: ${deviceId}`)

    const response = await aiClient.post('/predict', payload)

    const prediction = response.data

    console.log(
      `✅ AI prediction received: ${prediction.status} (confidence: ${prediction.confidence})`,
    )

    return {
      status: prediction.status || 'normal', // 'normal', 'warning', 'critical'
      confidence: prediction.confidence || 0.95,
      modelVersion: prediction.model_version || 'v1.0',
      risk_score: prediction.risk_score || 0,
      recommendations: prediction.recommendations || [],
    }
  } catch (error) {
    console.error('❌ AI service error:', error.message)

    // Fallback: rule-based prediction nếu AI service fail
    return fallbackPrediction(healthData)
  }
}

/**
 * Fallback prediction nếu AI service không available
 * Dùng rule-based logic đơn giản
 */
const fallbackPrediction = (healthData) => {
  const { bpm, spo2, status } = healthData

  let predictedStatus = 'normal'
  let confidence = 0.7
  let riskScore = 0

  // Rule-based logic
  if (status === 'DANGER' || bpm > 120 || spo2 < 90) {
    predictedStatus = 'critical'
    confidence = 0.85
    riskScore = 0.9
  } else if (bpm > 100 || spo2 < 95) {
    predictedStatus = 'warning'
    confidence = 0.75
    riskScore = 0.6
  }

  console.log(`⚠️  Using fallback prediction: ${predictedStatus}`)

  return {
    status: predictedStatus,
    confidence,
    modelVersion: 'fallback_v1',
    risk_score: riskScore,
    recommendations: [],
  }
}

/**
 * Health check AI service
 */
export const checkAIServiceHealth = async () => {
  try {
    const response = await aiClient.get('/health')
    return response.data
  } catch (error) {
    console.error('❌ AI service health check failed:', error.message)
    return { status: 'unavailable' }
  }
}
