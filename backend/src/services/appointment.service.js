import { format, getDay } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { StatusCodes } from 'http-status-codes'
import { env } from '@/config/env'
import Conversation from '@/models/nosql/conversation'
import Message from '@/models/nosql/message'
import * as appointmentRepo from '@/repositories/appointment.repo'
import * as doctorRepo from '@/repositories/doctor.repo'
import * as patientDoctorRepo from '@/repositories/patientDoctor.repo'
import * as userRepo from '@/repositories/user.repo'
import { createAndSendNotification } from '@/services/notification.service'
import {
  emitAppointmentNewToUsers,
  emitAppointmentUpdateToUsers,
} from '@/sockets/emitters/system.emitters'
import ApiError from '@/utils/api-error'

/**
 * Get appointments for logged in user (doctor or patient) with filter
 */
export const getMyAppointments = async (
  userId,
  role,
  { page, limit, status, type, scheduledFrom, scheduledTo, search },
) => {
  if (role === 'doctor') {
    return await appointmentRepo.findByDoctorId(userId, {
      page,
      limit,
      status,
      type,
      scheduledFrom,
      scheduledTo,
      search,
    })
  } else if (role === 'patient') {
    return await appointmentRepo.findByPatientId(userId, {
      page,
      limit,
      status,
    })
  }
}

/**
 * Lịch phải thuộc đúng cặp bác sĩ–bệnh nhân đang gọi
 */
export const assertAppointmentLinkedToCall = async (
  appointmentId,
  userIdA,
  userIdB,
) => {
  const appointment = await appointmentRepo.findById(appointmentId)
  if (!appointment)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Appointment not found',
      'APPOINTMENT_NOT_FOUND',
    )

  const a = Number(userIdA)
  const b = Number(userIdB)
  const participants = new Set([
    Number(appointment.patientId),
    Number(appointment.doctorId),
  ])

  if (!participants.has(a) || !participants.has(b))
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Appointment does not match call participants',
      'APPOINTMENT_CALL_MISMATCH',
    )

  return appointment
}

/**
 * Chi tiết lịch — chỉ bác sĩ/bệnh nhân của ca đó.
 */
export const getMyAppointmentById = async (userId, role, appointmentId) => {
  const appointment = await appointmentRepo.findByIdWithRelations(appointmentId)
  if (!appointment)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Appointment not found',
      'APPOINTMENT_NOT_FOUND',
    )

  if (role === 'doctor' && Number(appointment.doctorId) !== Number(userId))
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied', 'FORBIDDEN')

  if (role === 'patient' && Number(appointment.patientId) !== Number(userId))
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied', 'FORBIDDEN')

  return appointment
}

/**
 * Get appointment by patient ID and doctor ID
 */
export const getAppointmentByPatientIdAndDoctorId = async (
  patientId,
  doctorId,
  { page, limit, status, type, scheduledFrom, scheduledTo },
) => {
  return await appointmentRepo.findByPatientIdAndDoctorId(patientId, doctorId, {
    page,
    limit,
    status,
    type,
    scheduledFrom,
    scheduledTo,
  })
}

/**
 * Cancel appointment by ID (by doctor or patient)
 */
export const cancelAppointment = async (
  appointmentId,
  { cancelReason },
  actorId,
  role,
) => {
  const appointment = await appointmentRepo.findById(appointmentId)
  if (!appointment)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Appointment not found',
      'APPOINTMENT_NOT_FOUND',
    )

  if (appointment.status === 'cancelled')
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Appointment is already cancelled',
      'ALREADY_CANCELLED',
    )

  const prefix = role === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'
  const updated = await appointmentRepo.update(appointmentId, {
    cancelReason: `${prefix}: ${cancelReason}`,
    status: 'cancelled',
  })

  // Gửi notification cho phía còn lại
  // Doctor hủy → noti cho bệnh nhân; Patient hủy → noti cho bác sĩ
  const recipientId =
    role === 'doctor' ? appointment.patientId : appointment.doctorId

  const notifTitle =
    role === 'doctor'
      ? 'Lịch hẹn đã bị hủy bởi bác sĩ'
      : 'Bệnh nhân đã hủy lịch hẹn'

  const patient = await userRepo.getNameById(appointment.patientId)
  const doctor = await userRepo.getNameById(appointment.doctorId)
  try {
    await createAndSendNotification({
      recipientId,
      senderId: actorId,
      type: 'appointment',
      title: notifTitle,
      content: `Lịch hẹn vào lúc ${format(appointment.scheduledAt, 'HH:mm')} ngày ${format(appointment.scheduledAt, 'dd/MM/yyyy')} với ${prefix} ${role === 'doctor' ? patient?.fullName : doctor?.fullName} đã bị hủy. Lý do: ${cancelReason}`,
      referenceId: String(appointmentId),
    })
  } catch (err) {
    console.error('[cancelAppointment] Failed to send notification:', err)
  }

  if (updated) {
    emitAppointmentUpdateToUsers(
      [appointment.doctorId, appointment.patientId],
      {
        id: updated.id,
        status: updated.status,
        cancelReason: updated.cancelReason,
        scheduledAt: updated.scheduledAt,
        doctorId: updated.doctorId,
        patientId: updated.patientId,
        type: updated.type,
      },
    )
  }

  return updated
}

/**
 * Helper: Tạo các slot 30 phút trong khoảng [startTime, endTime)
 */
const generateSlots = (startTime, endTime, durationMin = 30) => {
  const slots = []
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  let current = sh * 60 + sm
  const end = eh * 60 + em
  while (current + durationMin <= end) {
    const h = String(Math.floor(current / 60)).padStart(2, '0')
    const m = String(current % 60).padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += durationMin
  }
  return slots
}

/**
 * Helper: Chuyển đổi thời gian thành phút
 */
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Helper: Kiểm tra slot có bị block bởi off schedule hoặc appointment đã đặt không
 */
const isSlotAvailable = (slot, durationMin, offSchedules, bookedAppts) => {
  const slotStart = timeToMinutes(slot)
  const slotEnd = slotStart + durationMin

  // Kiểm tra overlap với off schedules
  for (const off of offSchedules) {
    if (!off.startTime) return false // Nghỉ cả ngày

    const offStart = timeToMinutes(off.startTime)
    const offEnd = timeToMinutes(off.endTime)
    if (slotStart < offEnd && slotEnd > offStart) return false
  }

  // Kiểm tra overlap với appointments đã đặt
  for (const appt of bookedAppts) {
    // Chuyển appt.scheduledAt về giờ địa phương của phòng khám
    const apptHour = Number(
      formatInTimeZone(appt.scheduledAt, env.APP_TIME_ZONE, 'HH'),
    )
    const apptMinute = Number(
      formatInTimeZone(appt.scheduledAt, env.APP_TIME_ZONE, 'mm'),
    )
    const apptStart = apptHour * 60 + apptMinute
    const apptEnd = apptStart + (appt.durationMinutes ?? 30)
    if (slotStart < apptEnd && slotEnd > apptStart) return false
  }

  return true
}

/**
 * Lấy danh sách slot trống của bác sĩ theo ngày
 */
export const getAvailableSlots = async (doctorId, date) => {
  const doctor = await doctorRepo.findByUserId(doctorId)
  if (!doctor)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Doctor not found',
      'DOCTOR_NOT_FOUND',
    )

  const dayOfWeek = getDay(date) // 0=Sun, 1=Mon, 2=Tue, ...

  const [workingHours, offSchedules, bookedAppts] = await Promise.all([
    appointmentRepo.getWorkingHours(doctorId, dayOfWeek),
    appointmentRepo.getOffSchedules(doctorId, date),
    appointmentRepo.getBookedAppointments(doctorId, date),
  ])

  if (!workingHours.length) return []

  const todayStr = formatInTimeZone(new Date(), env.APP_TIME_ZONE, 'yyyy-MM-dd')
  if (date < todayStr) return []

  const allSlots = workingHours.flatMap((wh) =>
    generateSlots(wh.startTime, wh.endTime, 30),
  )

  let slots = allSlots.filter((slot) =>
    isSlotAvailable(slot, 30, offSchedules, bookedAppts),
  )

  // Trong ngày hôm nay (theo múi giờ phòng khám): bỏ slot có giờ bắt đầu đã qua
  if (date === todayStr) {
    const now = new Date()
    const hh = Number(formatInTimeZone(now, env.APP_TIME_ZONE, 'HH'))
    const mm = Number(formatInTimeZone(now, env.APP_TIME_ZONE, 'mm'))
    const nowMinutes = hh * 60 + mm
    slots = slots.filter((slot) => timeToMinutes(slot) > nowMinutes)
  }

  return slots
}

/**
 * Create new appointment
 */
export const createAppointment = async ({
  patientId,
  doctorId,
  scheduledAt,
  durationMinutes = 30,
  type,
  reason,
  initiatedBy,
}) => {
  // Chuyển scheduledAt về giờ địa phương của phòng khám để kiểm tra slot
  const dateStr = formatInTimeZone(scheduledAt, env.APP_TIME_ZONE, 'yyyy-MM-dd')
  const slotTime = formatInTimeZone(scheduledAt, env.APP_TIME_ZONE, 'HH:mm')

  const available = await getAvailableSlots(doctorId, dateStr)
  if (!available.includes(slotTime))
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Selected time slot is no longer available',
      'SLOT_UNAVAILABLE',
    )

  const createdAppointment = await appointmentRepo.create({
    patientId,
    doctorId,
    scheduledAt,
    durationMinutes,
    type,
    reason,
    status: initiatedBy === 'doctor' ? 'confirmed' : 'pending',
  })

  if (initiatedBy === 'patient') {
    const patient = await userRepo.getNameById(patientId)
    // Tạo Notification trong DB cho bác sĩ
    try {
      await createAndSendNotification({
        recipientId: doctorId,
        senderId: patientId,
        type: 'appointment',
        title: 'Lịch hẹn mới cần xác nhận',
        content: `Bạn có một lịch hẹn mới vào lúc ${format(scheduledAt, 'HH:mm')} ngày ${format(scheduledAt, 'dd/MM/yyyy')} với bệnh nhân ${patient?.fullName || ''}. Vui lòng xác nhận lịch hẹn.`,
        referenceId: String(createdAppointment.id),
      })
    } catch (err) {
      console.error('[createAppointmentBooking] Failed to notify doctor:', err)
    }
  } else {
    const doctor = await userRepo.getNameById(doctorId)
    // Tạo Notification trong DB cho bệnh nhân
    try {
      await createAndSendNotification({
        recipientId: patientId,
        senderId: doctorId,
        type: 'appointment',
        title: 'Bác sĩ đã tạo lịch hẹn mới',
        content: `Bác sĩ ${doctor?.fullName || ''} đã tạo lịch hẹn mới vào lúc ${format(scheduledAt, 'HH:mm')} ngày ${format(scheduledAt, 'dd/MM/yyyy')} với bạn. Vui lòng kiểm tra lịch hẹn.`,
        referenceId: String(createdAppointment.id),
      })
    } catch (err) {
      console.error('[createAppointmentBooking] Failed to notify patient:', err)
    }
  }

  if (createdAppointment) {
    emitAppointmentNewToUsers([doctorId, patientId], {
      id: createdAppointment.id,
      status: createdAppointment.status,
      scheduledAt: createdAppointment.scheduledAt,
      doctorId: createdAppointment.doctorId,
      patientId: createdAppointment.patientId,
      type: createdAppointment.type,
    })
  }

  return createdAppointment
}

/**
 * Confirm appointment by ID (by doctor)
 */
export const confirmAppointment = async (appointmentId, actorId) => {
  const appointment = await appointmentRepo.findById(appointmentId)
  if (!appointment)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Selected appointment not found',
      'APPOINTMENT_NOT_FOUND',
    )

  if (appointment.status !== 'pending')
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Selected appointment is not in pending status',
      'INVALID_STATUS',
    )

  // Kiểm tra thời gian xác nhận lịch hẹn
  const startMs = new Date(appointment.scheduledAt).getTime()
  const now = Date.now()
  const lockMs = env.APPOINTMENT_CONFIRM_LOCK_MINUTES_BEFORE * 60 * 1000

  if (startMs <= now)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot confirm an appointment that has already started or ended',
      'APPOINTMENT_ALREADY_STARTED',
    )

  if (startMs - now < lockMs)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Too close to appointment time to confirm',
      'CONFIRM_TOO_CLOSE',
    )

  const { patientId, doctorId } = appointment

  const updatedAppointment = await appointmentRepo.update(appointmentId, {
    status: 'confirmed',
  })

  if (updatedAppointment) {
    emitAppointmentUpdateToUsers([doctorId, patientId], {
      id: updatedAppointment.id,
      status: updatedAppointment.status,
      scheduledAt: updatedAppointment.scheduledAt,
      doctorId: updatedAppointment.doctorId,
      patientId: updatedAppointment.patientId,
      type: updatedAppointment.type,
    })
  }

  // Đảm bảo quan hệ patient-doctor tồn tại
  await patientDoctorRepo.ensurePatientDoctor(patientId, doctorId)

  // Tìm hoặc tạo conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [patientId, doctorId] },
  })

  const conversationExisted = !!conversation

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [patientId, doctorId],
      unread_counts: {},
    })
  }

  // Chỉ tin nhắn chào hệ thống khi vừa mở chat lần đầu
  if (!conversationExisted) {
    const systemContent =
      'Lịch hẹn đã được xác nhận. Bạn có thể trò chuyện với bác sĩ tại đây.'

    const message = await Message.create({
      conversation_id: conversation._id,
      sender_id: doctorId,
      type: 'system_alert',
      content: {
        text: systemContent,
      },
      status: 'sent',
    })

    // Cập nhật last_message + unread_counts cho patient
    const currentUnread = conversation.unread_counts.get(String(patientId)) ?? 0
    conversation.last_message = {
      message_id: message._id,
      sender_id: doctorId,
      type: 'system_alert',
      content: systemContent,
      created_at: message.created_at,
    }
    conversation.unread_counts.set(String(patientId), currentUnread + 1)
    await conversation.save()
  }

  // Gửi notification cho bệnh nhân
  const doctor = await userRepo.getNameById(doctorId)
  try {
    await createAndSendNotification({
      recipientId: patientId,
      senderId: actorId,
      type: 'appointment',
      title: 'Lịch hẹn đã được xác nhận',
      content: `Lịch hẹn vào lúc ${format(appointment.scheduledAt, 'HH:mm')}, ngày ${format(appointment.scheduledAt, 'dd/MM/yyyy')} của bạn với Bác sĩ ${doctor?.fullName || ''} đã được xác nhận.`,
      referenceId: String(appointmentId),
    })
  } catch (err) {
    console.error('[confirmAppointment] Failed to send notification:', err)
  }

  return await appointmentRepo.findById(appointmentId)
}

const DOCTOR_STATUS_PATCH_ALLOWED = {
  confirmed: ['completed', 'cancelled'],
  cancelled: ['completed'],
}

/**
 * Bác sĩ chỉnh trạng thái (đã hết ca và trong cửa sổ thời gian cấu hình).
 */
export const patchAppointmentStatusByDoctor = async (
  appointmentId,
  doctorId,
  { status: nextStatus, cancelReason },
) => {
  const appointment = await appointmentRepo.findById(appointmentId)
  if (!appointment)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Appointment not found',
      'APPOINTMENT_NOT_FOUND',
    )

  if (appointment.doctorId !== doctorId)
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot modify this appointment',
      'FORBIDDEN',
    )

  const allowedNext = DOCTOR_STATUS_PATCH_ALLOWED[appointment.status]
  if (!allowedNext?.includes(nextStatus))
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Invalid status transition for correction',
      'INVALID_STATUS_TRANSITION',
    )

  const durationMin = appointment.durationMinutes ?? 30
  const visitEndMs =
    new Date(appointment.scheduledAt).getTime() + durationMin * 60 * 1000
  const now = Date.now()
  const minAllowedMs =
    visitEndMs +
    env.APPOINTMENT_DOCTOR_STATUS_EDIT_MIN_HOURS_AFTER_END * 3600000
  const maxAllowedMs =
    visitEndMs +
    env.APPOINTMENT_DOCTOR_STATUS_EDIT_MAX_HOURS_AFTER_END * 3600000

  if (now < minAllowedMs || now > maxAllowedMs)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Status can only be corrected within the allowed time window after the visit',
      'STATUS_EDIT_WINDOW_CLOSED',
    )

  const patch = { status: nextStatus }
  if (nextStatus === 'cancelled') {
    if (!cancelReason?.trim())
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Cancel reason is required',
        'CANCEL_REASON_REQUIRED',
      )
    patch.cancelReason = `Bác sĩ (điều chỉnh): ${cancelReason.trim()}`
  }

  const updated = await appointmentRepo.update(appointmentId, patch)
  if (updated) {
    emitAppointmentUpdateToUsers(
      [appointment.doctorId, appointment.patientId],
      {
        id: updated.id,
        status: updated.status,
        cancelReason: updated.cancelReason,
        scheduledAt: updated.scheduledAt,
        doctorId: updated.doctorId,
        patientId: updated.patientId,
        type: updated.type,
      },
    )
  }

  const doctor = await userRepo.getNameById(doctorId)
  const whenLabel = `${format(appointment.scheduledAt, 'HH:mm')} ngày ${format(appointment.scheduledAt, 'dd/MM/yyyy')}`

  try {
    if (nextStatus === 'completed') {
      await createAndSendNotification({
        recipientId: appointment.patientId,
        senderId: doctorId,
        type: 'appointment',
        title: 'Cập nhật trạng thái lịch hẹn',
        content: `Bác sĩ ${doctor?.fullName || ''} đã cập nhật lịch hẹn ${whenLabel} với bạn sang trạng thái đã hoàn thành.`,
        referenceId: String(appointmentId),
      })
    } else if (nextStatus === 'cancelled') {
      await createAndSendNotification({
        recipientId: appointment.patientId,
        senderId: doctorId,
        type: 'appointment',
        title: 'Lịch hẹn được đánh dấu hủy',
        content: `Lịch hẹn ${whenLabel} đã được cập nhật sang đã hủy. Lý do: ${cancelReason.trim()}`,
        referenceId: String(appointmentId),
      })
    }
  } catch (err) {
    console.error('[patchAppointmentStatusByDoctor] Failed to notify:', err)
  }

  return updated
}

/**
 * Cron: pending đã quá giờ hẹn → cancelled + thông báo BN.
 */
export const expireStalePendingAppointments = async () => {
  const rows = await appointmentRepo.findPendingScheduledBefore(new Date())
  const cancelReason =
    'Hệ thống: Lịch hẹn đã quá giờ mà chưa được bác sĩ xác nhận, đã tự động hủy bởi hệ thống.'

  for (const appt of rows) {
    const updated = await appointmentRepo.update(appt.id, {
      status: 'cancelled',
      cancelReason,
    })
    if (!updated) continue

    try {
      await createAndSendNotification({
        recipientId: appt.patientId,
        senderId: appt.doctorId,
        type: 'appointment',
        title: 'Lịch hẹn đã bị hủy tự động',
        content: `Lịch hẹn vào lúc ${format(appt.scheduledAt, 'HH:mm')} ngày ${format(appt.scheduledAt, 'dd/MM/yyyy')} đã bị hủy do không được xác nhận đúng hạn.`,
        referenceId: String(appt.id),
      })
    } catch (err) {
      console.error('[expireStalePendingAppointments] Failed to notify:', err)
    }

    emitAppointmentUpdateToUsers([appt.doctorId, appt.patientId], {
      id: appt.id,
      status: 'cancelled',
      cancelReason,
      scheduledAt: appt.scheduledAt,
      doctorId: appt.doctorId,
      patientId: appt.patientId,
      type: appt.type,
    })
  }

  return rows.length
}
