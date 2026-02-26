import amqp from 'amqplib'
import { env } from '@/config'
import { QUEUES, EXCHANGES } from './queues'

// Build RabbitMQ URL: prefer full URL from env, else compose from host/port
const getRabbitUrl = () =>
  env.RABBITMQ_URL || `amqp://${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`

let connection
let channel

/**
 * Connect to RabbitMQ server
 */
export const connectRabbitMQ = async () => {
  try {
    const connectionOptions = {
      heartbeat: 60, // CloudAMQP recommends 60s heartbeat
      timeout: 30000 // 30s connection timeout
    }

    const url = getRabbitUrl()
    connection = await amqp.connect(url, connectionOptions)
    channel = await connection.createChannel()

    // Assert exchange
    await channel.assertExchange(EXCHANGES.HEALTH, 'topic', { durable: true })

    // Assert queues
    await channel.assertQueue(QUEUES.HEALTH_DATA, { durable: true })
    await channel.assertQueue(QUEUES.HEALTH_ALERT, { durable: true })

    // Bind queues to exchange
    await channel.bindQueue(
      QUEUES.HEALTH_DATA,
      EXCHANGES.HEALTH,
      'health.data.*'
    )
    await channel.bindQueue(
      QUEUES.HEALTH_ALERT,
      EXCHANGES.HEALTH,
      'health.alert.*'
    )

    channel.prefetch(10) // Chống overload

    console.log('RabbitMQ connected')

    // Handle connection errors
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err)
    })

    connection.on('close', () => {
      console.log('RabbitMQ connection closed')
      setTimeout(connectRabbitMQ, 5000) // Auto reconnect
    })

    return channel
  } catch (error) {
    console.error('Failed to connect RabbitMQ:', error)
    setTimeout(connectRabbitMQ, 5000) // Auto reconnect
  }
}

/**
 * Get RabbitMQ channel
 */
export const getChannel = async () => {
  if (!channel) {
    await connectRabbitMQ()
  }
  return channel
}

/**
 * Close RabbitMQ connection
 */
export const closeRabbitMQ = async () => {
  if (channel) await channel.close()
  if (connection) await connection.close()
}
