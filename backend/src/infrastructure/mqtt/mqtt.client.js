import mqtt from 'mqtt'
import { env } from '@/config'
import { publishHealthData } from '@/modules/health/health.producer'

let mqttClient

/**
 * Connect to MQTT broker and subscribe to topics
 */
export const connectMQTT = () => {
  const broker = env.MQTT_BROKER + ':' + env.MQTT_PORT

  mqttClient = mqtt.connect(broker, {
    clientId: `backend_server_${Math.random().toString(16).slice(2, 8)}`,
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 30000
  })

  mqttClient.on('connect', () => {
    console.log('MQTT connected to', broker)

    // Subscribe telemetry from all devices
    mqttClient.subscribe(env.MQTT_TOPIC, { qos: 0 }, (err) => {
      if (err) {
        console.error('MQTT subscribe error:', err)
      } else {
        console.log('Subscribed to topic:', env.MQTT_TOPIC)
      }
    })
  })

  mqttClient.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString())
      const deviceId = topic.split('/')[1]

      await handleTelemetry(deviceId, payload)
    } catch (error) {
      console.error('MQTT message parse error:', error, 'topic:', topic)
    }
  })

  mqttClient.on('error', (error) => {
    console.error('MQTT error:', error)
  })

  mqttClient.on('offline', () => {
    console.log('MQTT offline')
  })

  mqttClient.on('reconnect', () => {
    console.log('MQTT reconnecting...')
  })

  return mqttClient
}

/**
 * Handle telemetry data from devices
 */
const handleTelemetry = async (deviceId, payload) => {
  const { ts, metrics, ecg, status } = payload

  if (!metrics || !ecg) {
    console.warn('Invalid telemetry payload:', payload)
    return
  }

  // Publish vào RabbitMQ để xử lý async
  await publishHealthData({
    deviceId: deviceId,
    timestamp: ts,
    bpm: metrics.bpm,
    spo2: metrics.spo2,
    hrv: metrics.hrv,
    ecgData: ecg,
    status
  })
}

/**
 * Get MQTT client instance
 */
export const getMQTTClient = () => mqttClient

/**
 * Disconnect MQTT client
 */
export const disconnectMQTT = () => {
  if (mqttClient) {
    mqttClient.end()
    console.log('MQTT disconnected')
  }
}
