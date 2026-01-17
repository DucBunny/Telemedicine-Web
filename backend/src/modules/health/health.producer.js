import { publishToExchange } from '@/infrastructure/message/rabbitmq.publisher'
import { EXCHANGES, ROUTING_KEYS } from '@/infrastructure/message/queues'

/**
 * Publish health data vào RabbitMQ
 */
export const publishHealthData = async (message) => {
  try {
    await publishToExchange(
      EXCHANGES.HEALTH,
      ROUTING_KEYS.HEALTH_DATA,
      message,
      { persistent: true }
    )
    console.log(`Published health data for device ${message.deviceId}`)
  } catch (error) {
    console.error('Failed to publish health data:', error)
  }
}

/**
 * Publish alert vào RabbitMQ
 */
export const publishHealthAlert = async (alert) => {
  try {
    await publishToExchange(
      EXCHANGES.HEALTH,
      ROUTING_KEYS.HEALTH_ALERT,
      alert,
      { persistent: true }
    )
    console.log(`Published health alert for device ${alert.deviceId}`)
  } catch (error) {
    console.error('Failed to publish alert:', error)
  }
}
