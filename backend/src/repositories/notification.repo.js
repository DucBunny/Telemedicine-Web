import { Notification, User } from '@/models/sql/index'

/**
 * Get notifications for a user - Cursor-based pagination
 */
export const getNotifications = async (
  userId,
  { nextCursor, limit = 8, isRead }
) => {
  const parsedLimit = Math.min(limit, 10)
  const whereClause = { userId }

  if (isRead !== undefined) {
    whereClause.isRead = isRead
  }

  const result = await Notification.cursorPaginate({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['fullName']
      }
    ],
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC']
    ],
    limit: parsedLimit, // Max 10 items per request
    after: nextCursor ? nextCursor : null, // Cursor for pagination
    raw: false
  })

  const data = (result.edges || []).map((edge) => edge.node)

  return {
    data,
    meta: {
      nextCursor: result.pageInfo?.endCursor || null,
      hasMore: result.pageInfo?.hasNextPage || false,
      count: data.length,
      total: result.totalCount
    }
  }
}

/**
 * Get unread count for a user
 */
export const getUnreadCount = async (userId) => {
  return await Notification.count({
    where: { userId, isRead: false }
  })
}

/**
 * Mark notification as read
 * - Only the owner of the notification can mark it as read
 * - Returns null if notification not found or user is not the owner
 */
export const markAsRead = async (id, userId) => {
  const [updated] = await Notification.update(
    {
      isRead: true,
      readAt: new Date()
    },
    { where: { id, userId } }
  )
  return updated > 0 ? await Notification.findByPk(id) : null
}

/**
 * Mark notification as unread
 */
export const markAsUnread = async (id, userId) => {
  const [updated] = await Notification.update(
    {
      isRead: false,
      readAt: null
    },
    { where: { id, userId } }
  )
  return updated > 0 ? await Notification.findByPk(id) : null
}

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId) => {
  return await Notification.update(
    {
      isRead: true,
      readAt: new Date()
    },
    { where: { userId, isRead: false } }
  )
}

/**
 * Create a notification
 */
export const create = async (data) => {
  return await Notification.create(data)
}

/**
 * Delete notification
 */
export const deleteNotification = async (id, userId) => {
  return await Notification.destroy({
    where: { id, userId }
  })
}
