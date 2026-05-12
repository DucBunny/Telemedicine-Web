import Redis from 'ioredis'
import { env } from '@/config'

export const redis = env.REDIS_URL
  ? new Redis(env.REDIS_URL, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
      tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
    })
  : new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
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
