import Redis from 'ioredis'
import { env } from '@/config'

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  tls: env.REDIS_TLS ? {} : undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: null,
})

redis.on('connect', () => {
  console.log('[Redis] Connected successfully.')
})

redis.on('ready', () => {
  console.log('[Redis] Ready to receive commands.')
})

redis.on('reconnecting', () => {
  console.warn('[Redis] Connection lost. Attempting to reconnect...')
})

redis.on('error', (err) => {
  console.error('[Redis] Error:', err)
})
