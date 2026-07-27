import { redis } from '@/config'

/**
 * Cache Presence (Online/Offline) lưu trữ trạng thái online/offline của user
 */

const presenceKey = (userId) => `presence:user:${userId}`

// TTL key presence; zombie keys sau crash/mất disconnect được Redis xóa sau khoảng này.
export const PRESENCE_TTL_SECONDS = 180 // 3 minutes

// Gia hạn TTL trên server trong lúc socket còn sống; nên ≤ ~TTL/3.
export const PRESENCE_REFRESH_INTERVAL_MS = 60 * 1000 // 60 seconds = 1 minute

/**
 * Gia hạn TTL khi user vẫn đang kết nối (gọi định kỳ từ system socket handler)
 */
export const refreshTtl = async (userId) => {
  try {
    const key = presenceKey(userId)
    await redis.expire(key, PRESENCE_TTL_SECONDS)
  } catch (error) {
    console.error(
      `[Redis Presence] Error refreshing TTL for user ${userId}:`,
      error,
    )
  }
}

/**
 * Cập nhật socketId mới vào set của user
 */
export const addSocket = async (userId, socketId) => {
  try {
    const key = presenceKey(userId)
    await redis.sadd(key, socketId)

    // Đặt TTL để tự động xóa key nếu không còn socket nào hoạt động (phòng trường hợp server crash)
    await redis.expire(key, PRESENCE_TTL_SECONDS)
  } catch (error) {
    console.error(
      `[Redis Presence] Error adding socket for user ${userId}:`,
      error,
    )
  }
}

/**
 * Xóa socketId khi tab đóng
 */
export const removeSocket = async (userId, socketId) => {
  try {
    const key = presenceKey(userId)
    await redis.srem(key, socketId)
  } catch (error) {
    console.error(
      `[Redis Presence] Error removing socket for user ${userId}:`,
      error,
    )
  }
}

/**
 * Kiểm tra xem user còn socket nào đang hoạt động không
 */
export const isUserOnline = async (userId) => {
  try {
    const key = presenceKey(userId)
    const count = await redis.scard(key)
    return count > 0
  } catch (error) {
    console.error(
      `[Redis Presence] Error checking online status for user ${userId}:`,
      error,
    )
    return false // Nếu lỗi Redis, mặc định cho là offline để an toàn
  }
}

/**
 * Lấy trạng thái online của nhiều user cùng lúc
 */
export const getMultipleUsersStatus = async (userIds) => {
  if (!userIds || userIds.length === 0) return {}

  try {
    // Dùng pipeline gom nhiều lệnh thành 1 request duy nhất tới Redis
    const pipeline = redis.pipeline()

    userIds.forEach((id) => {
      pipeline.scard(presenceKey(id))
    })

    const results = await pipeline.exec()

    const statusMap = {}
    userIds.forEach((id, index) => {
      // results[index] thường có format: [error, result]
      const count = results[index][1]
      statusMap[id] = count > 0
    })

    return statusMap
  } catch (error) {
    console.error(`[Redis Presence] Error in getMultipleUsersStatus:`, error)
    return {} // Lỗi thì trả về object rỗng (ai cũng offline)
  }
}
