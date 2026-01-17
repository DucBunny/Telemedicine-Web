import { getChannel } from './rabbitmq.client'

/**
 * Publish message to an exchange with routing key
 */
export const publishToExchange = async (exchange, routingKey, payload, options = { persistent: true }) => {
  const channel = await getChannel()
  return channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), options)
}

/**
 * Send message directly to a queue
 */
export const sendToQueue = async (queue, payload, options = { persistent: true }) => {
  const channel = await getChannel()
  return channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), options)
}
