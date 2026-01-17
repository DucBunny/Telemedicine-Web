import { getChannel } from '@/infrastructure/message/rabbitmq.client'
import { QUEUES } from '@/infrastructure/message/queues'
import {
  cacheHealthData,
  setDebounce
} from '@/infrastructure/cache/redis.cache'
import { saveHealthData, createHealthAlert } from './health.service'
import { publishHealthAlert } from './health.producer'
import { predictHealthStatus } from '@/services/ai.service'
import { emitHealthData, emitAlert } from '@/services/socket.service'

/**
 * Consumer xử lý health data từ RabbitMQ
 */
export const startHealthConsumer = async () => {
  try {
    const channel = await getChannel()

    console.log('Health consumer started')

    await channel.consume(QUEUES.HEALTH_DATA, async (msg) => {
      if (!msg) return

      try {
        const payload = JSON.parse(msg.content.toString())
        const { deviceId, timestamp, bpm, spo2, hrv, ecgData, status } = payload

        console.log(`Processing health data for device ${deviceId}`)

        const preCritical = bpm > 120 || bpm < 40 || spo2 < 94 || hrv < 20

        // Chỉ debounce nếu không phải critical data
        if (!preCritical) {
          // Redis debounce (tránh lưu quá nhiều trong thời gian ngắn)
          const debounceKey = `health:debounce:${deviceId}`
          const shouldProcess = await setDebounce(debounceKey, 2) // 2 giây debounce

          if (!shouldProcess) {
            console.log(`Skipping debounced data for ${deviceId}`)
            channel.ack(msg)
            return
          }
        }

        // Cache latest data vào Redis
        await cacheHealthData(deviceId, {
          timestamp,
          bpm,
          spo2,
          hrv,
          status,
          updatedAt: new Date()
        })

        // Gửi đến AI service để predict
        const prediction = await predictHealthStatus({
          deviceId,
          bpm,
          spo2,
          hrv,
          ecgData,
          status
        })

        console.log(
          `AI Prediction: ${prediction.status} (confidence: ${prediction.confidence})`
        )

        // Lưu vào Database với prediction result
        const savedData = await saveHealthData({
          deviceId,
          timestamp,
          bpm,
          spo2,
          hrv,
          ecgData,
          status,
          prediction
        })

        // Emit realtime data lên frontend qua Socket.IO
        emitHealthData({
          deviceId,
          patientId: savedData?.patientId,
          bpm,
          spo2,
          hrv,
          status,
          prediction,
          timestamp
        })

        // Kiểm tra alert condition dựa trên AI prediction
        if (prediction.status === 'critical' || prediction.risk_score > 0.8) {
          await publishHealthAlert({
            deviceId,
            patientId: savedData?.patientId,
            type: 'critical',
            severity: 'critical',
            message: `Critical health status detected: BPM=${bpm}, SpO2=${spo2}, Risk=${(prediction.risk_score * 100).toFixed(1)}%`,
            timestamp: Date.now(),
            predictionId: savedData?.id,
            riskScore: prediction.risk_score
          })
        } else if (
          prediction.status === 'warning' ||
          prediction.risk_score > 0.5
        ) {
          await publishHealthAlert({
            deviceId,
            patientId: savedData?.patientId,
            type: 'warning',
            severity: 'warning',
            message: `Warning: Abnormal health metrics detected`,
            timestamp: Date.now(),
            predictionId: savedData?.id,
            riskScore: prediction.risk_score
          })
        }

        channel.ack(msg)
        console.log(`Health data processed for ${deviceId}`)
      } catch (error) {
        console.error('Error processing health data:', error)
        // Retry với delay
        channel.nack(msg, false, true)
      }
    })
  } catch (error) {
    console.error('Failed to start health consumer:', error)
  }
}

/**
 * Consumer xử lý health alerts
 */
export const startAlertConsumer = async () => {
  try {
    const channel = await getChannel()

    console.log('Alert consumer started')

    await channel.consume(QUEUES.HEALTH_ALERT, async (msg) => {
      if (!msg) return

      try {
        const alert = JSON.parse(msg.content.toString())

        console.log(
          `Processing alert for device ${alert.deviceId}:`,
          alert.message
        )

        // Lưu alert vào database
        const savedAlert = await createHealthAlert({
          patientId: alert.patientId,
          predictionId: alert.predictionId,
          severity: alert.severity || 'critical',
          message: alert.message,
          deviceId: alert.deviceId,
          riskScore: alert.riskScore
        })

        // Emit alert lên frontend qua Socket.IO
        emitAlert({
          patientId: alert.patientId,
          deviceId: alert.deviceId,
          severity: alert.severity,
          message: alert.message,
          predictionId: savedAlert?.id,
          riskScore: alert.riskScore
        })

        // TODO: Trigger notifications
        // - Gửi push notification cho patient app
        // - Gửi SMS/Email cho patient
        // - Gửi notification cho doctors phụ trách
        // - Trigger emergency protocol nếu severity = critical

        channel.ack(msg)
      } catch (error) {
        console.error('Error processing alert:', error)
        channel.nack(msg, false, false) // Không retry alert để tránh spam
      }
    })
  } catch (error) {
    console.error('Failed to start alert consumer:', error)
  }
}
