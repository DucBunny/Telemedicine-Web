/**
 * Build reusable access-control helpers for a socket connection.
 */
export const createSocketAccessControl = (socket) => {
  const currentUser = socket.user

  // Helper kiểm tra nếu người dùng có một trong các roles
  const hasRole = (...roles) => roles.includes(currentUser.role)

  // Helper gửi lỗi và ghi log khi quyền truy cập bị từ chối
  const deny = (eventName, message) => {
    socket.emit('socket:error', { event: eventName, message })
    console.warn(
      `[Socket] Denied ${eventName} for user:${currentUser.id}, role:${currentUser.role}`,
    )
  }

  // Helper yêu cầu xác thực người dùng
  const requireAuth = (eventName) => {
    if (currentUser.id) return true
    deny(eventName, 'Unauthorized')
    return false
  }

  // Helper yêu cầu người dùng có một trong các roles nhất định
  const requireRoles = (eventName, roles = []) => {
    if (!requireAuth(eventName)) return false

    const normalizedRoles = Array.isArray(roles) ? roles : [roles]
    if (hasRole(...normalizedRoles)) return true

    deny(eventName, 'Permission denied')
    return false
  }

  return {
    currentUser,
    hasRole,
    deny,
    requireAuth,
    requireRoles,
  }
}
