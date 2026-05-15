/**
 * Socket rooms (Rooms)
 * - Mỗi namespace (/system, /chat, /monitor) có thể có nhiều rooms
 * - Mỗi room có thể có nhiều users
 */
export const SOCKET_ROOMS = {
  // NAMESPACE: /system
  SYSTEM: {
    // Phòng cá nhân (Nhận Noti/Alert riêng) -> Ví dụ: user:123
    PERSONAL: (userId) => `user:${userId}`,

    // Phòng theo Role (Nhận thông báo chung cho 1 nhóm) -> Ví dụ: role:doctor
    ROLE: (role) => `role:${role}`,

    // Phòng thông báo toàn hệ thống (Static room, không cần ID) -> Ví dụ: system:global
    GLOBAL: 'system:global',
  },

  // NAMESPACE: /chat
  CHAT: {
    // Phòng chat thông thường -> Ví dụ: conversation:abc
    CONVERSATION: (conversationId) => `conversation:${conversationId}`,
  },

  // NAMESPACE: /monitor
  MONITOR: {
    // Bác sĩ xem bệnh nhân -> Ví dụ: monitor:patient:789
    PATIENT: (patientId) => `monitor:patient:${patientId}`,

    // (Tương lai) Kỹ thuật viên xem trạng thái thiết bị -> Ví dụ: monitor:device:DEV_001
    DEVICE: (deviceId) => `monitor:device:${deviceId}`,
  },
}

/**
 * Event theo định dạng [entity]:[action]
 * - [entity]: Thực thể cần tác động (ví dụ: appointment, patient, doctor, notification)
 * - [action]: Hành động cần thực hiện (ví dụ: created, updated, deleted, checked, assigned)
 */
export const SYSTEM_EVENTS = {
  ROOM_JOIN: 'room:join',

  PRESENCE_ONLINE: 'presence:online',
  PRESENCE_OFFLINE: 'presence:offline',

  ALERT_CRITICAL: 'alert:critical',
  ALERT_WARNING: 'alert:warning',
  ALERT_ACKNOWLEDGE: 'alert:acknowledge',

  APPOINTMENT_NEW: 'appointment:created',
  APPOINTMENT_UPDATE: 'appointment:updated',

  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_UNREAD_COUNT_UPDATE: 'notification:unread_count_update',

  CALL_INVITE: 'call:invite', // Người gọi gửi cuộc gọi
  CALL_INCOMING: 'call:incoming', // Có cuộc gọi đến
  CALL_ACCEPT: 'call:accept', // Chấp nhận cuộc gọi
  CALL_REJECT: 'call:reject', // Từ chối cuộc gọi
  CALL_END: 'call:end', // Cuộc gọi đã kết thúc
}

export const CHAT_EVENTS = {
  ROOM_JOIN: 'room:join',
  ROOM_JOIN_REJECTED: 'room:join_rejected',
  ROOM_LEAVE: 'room:leave',

  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_READ: 'message:read',

  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
}
