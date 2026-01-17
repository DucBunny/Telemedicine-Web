import { redisClient } from './redis.client'

export const cacheHealthData = async (deviceId, data, ttl = 300) => {
  const key = `health:latest:${deviceId}`
  await redisClient.setex(key, ttl, JSON.stringify(data))
}

export const getLatestHealthData = async (deviceId) => {
  const key = `health:latest:${deviceId}`
  const data = await redisClient.get(key)
  return data ? JSON.parse(data) : null
}

export const setDebounce = async (key, ttl = 3) => {
  return await redisClient.set(key, '1', 'EX', ttl, 'NX')
}
