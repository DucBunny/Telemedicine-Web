/**
 * System Namespace Emitters
 *
 * Các hàm emit sự kiện trên namespace /system:
 * - emitNotificationToUser: Gửi notification realtime đến 1 user cụ thể
 * - emitNotificationReadToUser: Thông báo 1 notification đã đọc
 * - emitNotificationUnreadCountUpdate: Cập nhật unread count realtime
 * - emitAppointmentNewToUsers: Thong bao lich hen moi
 * - emitAppointmentUpdateToUsers: Thong bao cap nhat lich hen
 */

import { getIo } from '@/sockets/io.instance'
import { SOCKET_ROOMS, SYSTEM_EVENTS } from '@/sockets/socket.constants'

/**
 * Emit notification:new đến phòng cá nhân của user trên /system namespace
 *
 * @param {number} userId - ID của user nhận notification
 * @param {object} notification - Dữ liệu notification cần gửi
 */
export const emitNotificationToUser = (userId, notification) => {
  const io = getIo()

  if (!io) {
    console.warn(
      '[System Emitter] io not initialized — cannot emit notification',
    )
    return
  }

  const room = SOCKET_ROOMS.SYSTEM.PERSONAL(userId)

  io.of('/system').to(room).emit(SYSTEM_EVENTS.NOTIFICATION_NEW, notification)

  console.log(`[System Emitter] notification:new → room "${room}"`)
}

/**
 * Emit notification:read đến phòng cá nhân của user trên /system namespace
 *
 * @param {number} userId - ID của user nhận event
 * @param {object} payload - Dữ liệu notification đã đọc
 */
export const emitNotificationReadToUser = (userId, payload) => {
  const io = getIo()

  if (!io) {
    console.warn('[System Emitter] io not initialized — cannot emit read')
    return
  }

  const room = SOCKET_ROOMS.SYSTEM.PERSONAL(userId)

  io.of('/system').to(room).emit(SYSTEM_EVENTS.NOTIFICATION_READ, payload)

  console.log(`[System Emitter] notification:read → room "${room}"`)
}

/**
 * Emit notification:unread_count_update đến phòng cá nhân của user
 *
 * @param {number} userId - ID của user nhận event
 * @param {number} count - Số lượng notification chưa đọc
 */
export const emitNotificationUnreadCountUpdate = (userId, count) => {
  const io = getIo()

  if (!io) {
    console.warn('[System Emitter] io not initialized — cannot emit unread')
    return
  }

  const room = SOCKET_ROOMS.SYSTEM.PERSONAL(userId)

  io.of('/system')
    .to(room)
    .emit(SYSTEM_EVENTS.NOTIFICATION_UNREAD_COUNT_UPDATE, { count })

  console.log(
    `[System Emitter] notification:unread_count_update → room "${room}"`,
  )
}

/**
 * Emit appointment:created đến phòng cá nhân của danh sách user
 *
 * @param {number[]} userIds - Danh sách user nhận event
 * @param {object} payload - Dữ liệu lịch hẹn
 */
export const emitAppointmentNewToUsers = (userIds, payload) => {
  const io = getIo()

  if (!io) {
    console.warn(
      '[System Emitter] io not initialized — cannot emit appointment new',
    )
    return
  }

  userIds.forEach((userId) => {
    io.of('/system')
      .to(SOCKET_ROOMS.SYSTEM.PERSONAL(userId))
      .emit(SYSTEM_EVENTS.APPOINTMENT_NEW, payload)
  })
}

/**
 * Emit appointment:updated đến phòng cá nhân của danh sách user
 *
 * @param {number[]} userIds - Danh sách user nhận event
 * @param {object} payload - Dữ liệu lịch hẹn
 */
export const emitAppointmentUpdateToUsers = (userIds, payload) => {
  const io = getIo()

  if (!io) {
    console.warn(
      '[System Emitter] io not initialized — cannot emit appointment update',
    )
    return
  }

  userIds.forEach((userId) => {
    io.of('/system')
      .to(SOCKET_ROOMS.SYSTEM.PERSONAL(userId))
      .emit(SYSTEM_EVENTS.APPOINTMENT_UPDATE, payload)
  })
}

/**
 * Emit alert:warning đến danh sách bác sĩ liên quan
 *
 * @param {number[]} doctorUserIds - user_id của các bác sĩ nhận cảnh báo
 * @param {object} payload - Dữ liệu cảnh báo
 */
export const emitAlertNewToDoctors = (doctorUserIds, payload) => {
  const io = getIo()

  if (!io) {
    console.warn('[System Emitter] io not initialized — cannot emit alert new')
    return
  }

  doctorUserIds.forEach((userId) => {
    io.of('/system')
      .to(SOCKET_ROOMS.SYSTEM.PERSONAL(userId))
      .emit(SYSTEM_EVENTS.ALERT_NEW, payload)
  })

  console.log(
    `[System Emitter] alert:warning → ${doctorUserIds.length} doctor(s)`,
  )
}

/**
 * ECG về normal — cho phép nháy lại khi abnormal tiếp theo (alert vẫn pending)
 */
export const emitAlertCalmToDoctors = (doctorUserIds, payload) => {
  const io = getIo()

  if (!io) {
    console.warn('[System Emitter] io not initialized — cannot emit alert calm')
    return
  }

  doctorUserIds.forEach((userId) => {
    io.of('/system')
      .to(SOCKET_ROOMS.SYSTEM.PERSONAL(userId))
      .emit(SYSTEM_EVENTS.ALERT_CALM, payload)
  })
}

/**
 * Chớp đỏ màn hình — cùng alert đang throttle, không tạo bản ghi mới
 */
export const emitAlertFlashToDoctors = (doctorUserIds, payload) => {
  const io = getIo()

  if (!io) {
    console.warn(
      '[System Emitter] io not initialized — cannot emit alert flash',
    )
    return
  }

  doctorUserIds.forEach((userId) => {
    io.of('/system')
      .to(SOCKET_ROOMS.SYSTEM.PERSONAL(userId))
      .emit(SYSTEM_EVENTS.ALERT_FLASH, payload)
  })
}

/**
 * Emit alert:updated đến danh sách bác sĩ liên quan
 *
 * @param {number[]} doctorUserIds - user_id của các bác sĩ nhận cảnh báo
 * @param {object} payload - Dữ liệu cảnh báo đã cập nhật
 */
export const emitAlertUpdateToDoctors = (doctorUserIds, payload) => {
  const io = getIo()

  if (!io) {
    console.warn(
      '[System Emitter] io not initialized — cannot emit alert update',
    )
    return
  }

  doctorUserIds.forEach((userId) => {
    io.of('/system')
      .to(SOCKET_ROOMS.SYSTEM.PERSONAL(userId))
      .emit(SYSTEM_EVENTS.ALERT_UPDATE, payload)
  })

  console.log(
    `[System Emitter] alert:updated → ${doctorUserIds.length} doctor(s)`,
  )
}
