import type { UserRole } from '@/features/auth/types/auth.types'

/**
 * Socket rooms (Rooms)
 * - Mỗi namespace (/system, /chat, /monitor, /call) có thể có nhiều rooms
 * - Mỗi room có thể có nhiều users
 */
export const SOCKET_ROOMS = {
  // NAMESPACE: /system
  SYSTEM: {
    // Phòng cá nhân (Nhận Noti/Alert riêng) -> Ví dụ: user:123
    PERSONAL: (userId: number) => `user:${userId}`,

    // Phòng theo Role (Nhận thông báo chung cho 1 nhóm) -> Ví dụ: role:doctor
    ROLE: (role: UserRole) => `role:${role}`,

    // Phòng thông báo toàn hệ thống (Static room, không cần ID) -> Ví dụ: system:global
    GLOBAL: 'system:global',
  },

  // NAMESPACE: /chat
  CHAT: {
    // Phòng chat thông thường -> Ví dụ: conversation:abc
    CONVERSATION: (conversationId: string) => `conversation:${conversationId}`,
  },

  // NAMESPACE: /monitor
  MONITOR: {
    // Bác sĩ xem bệnh nhân -> Ví dụ: monitor:patient:789
    PATIENT: (patientId: number) => `monitor:patient:${patientId}`,

    // (Tương lai) Kỹ thuật viên xem trạng thái thiết bị -> Ví dụ: monitor:device:DEV_001
    DEVICE: (deviceId: string) => `monitor:device:${deviceId}`,
  },

  // NAMESPACE: /call
  CALL: {
    // Phòng gọi điện WebRTC -> Ví dụ: call:1024
    SESSION: (callId: number | string) => `call:${callId}`,
  },
} as const

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
} as const

export const CHAT_EVENTS = {
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',

  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_READ: 'message:read',

  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
} as const
