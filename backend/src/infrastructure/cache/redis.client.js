import Redis from 'ioredis'
import { env } from '@/config'

/**
 * Redis client để cache health data
 */
export const redisClient = env.REDIS_URL
  ? new Redis(env.REDIS_URL, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
      tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined
    })
  : new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3
    })

redisClient.on('connect', () => {
  console.log('Redis connected')
})

redisClient.on('error', (err) => {
  console.error('Redis error:', err)
})
