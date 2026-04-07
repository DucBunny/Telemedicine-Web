import * as appointmentRepo from '@/repositories/appointment.repo'
import * as doctorRepo from '@/repositories/doctor.repo'
import Conversation from '@/models/nosql/conversation'
import Message from '@/models/nosql/message'
// import * as socketService from '@/services/socket.emitters'
import * as socketService from '@/services/socket.service'
import { env } from '@/config/env'
import ApiError from '@/utils/api-error'
import { StatusCodes } from 'http-status-codes'
import { getDay } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

/**
 * Get appointments for logged in user (doctor or patient) with filter
 */
export const getMyAppointments = async (
  userId,
  role,
  { page, limit, status }
) => {
  if (role === 'doctor') {
    return await appointmentRepo.findByDoctorId(userId, {
      page,
      limit,
      status
    })
  } else if (role === 'patient') {
    return await appointmentRepo.findByPatientId(userId, {
      page,
      limit,
      status
    })
  }
}

/**
 * Cancel appointment by ID (by doctor or patient)
 */
export const cancelAppointment = async (
  appointmentId,
  { cancelReason },
  role
) => {
  const appointment = await appointmentRepo.findById(appointmentId)
  if (!appointment)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Appointment not found',
      'APPOINTMENT_NOT_FOUND'
    )

  if (appointment.status === 'cancelled')
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Appointment is already cancelled',
      'ALREADY_CANCELLED'
    )

  return await appointmentRepo.update(appointmentId, {
    cancelReason:
      (role === 'patient' ? 'Bệnh nhân: ' : 'Bác sĩ: ') + cancelReason,
    status: 'cancelled'
  })
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
      formatInTimeZone(appt.scheduledAt, env.APP_TIME_ZONE, 'HH')
    )
    const apptMinute = Number(
      formatInTimeZone(appt.scheduledAt, env.APP_TIME_ZONE, 'mm')
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
      'DOCTOR_NOT_FOUND'
    )

  const dayOfWeek = getDay(date) // 0=Sun, 1=Mon, 2=Tue, ...

  const [workingHours, offSchedules, bookedAppts] = await Promise.all([
    appointmentRepo.getWorkingHours(doctorId, dayOfWeek),
    appointmentRepo.getOffSchedules(doctorId, date),
    appointmentRepo.getBookedAppointments(doctorId, date)
  ])

  if (!workingHours.length) return []

  const allSlots = workingHours.flatMap((wh) =>
    generateSlots(wh.startTime, wh.endTime, 30)
  )

  return allSlots.filter((slot) =>
    isSlotAvailable(slot, 30, offSchedules, bookedAppts)
  )
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
  reason
}) => {
  // Chuyển scheduledAt về giờ địa phương của phòng khám để kiểm tra slot
  const dateStr = formatInTimeZone(scheduledAt, env.APP_TIME_ZONE, 'yyyy-MM-dd')
  const slotTime = formatInTimeZone(scheduledAt, env.APP_TIME_ZONE, 'HH:mm')

  const available = await getAvailableSlots(doctorId, dateStr)
  if (!available.includes(slotTime))
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Selected time slot is no longer available',
      'SLOT_UNAVAILABLE'
    )

  return await appointmentRepo.create({
    patientId,
    doctorId,
    scheduledAt,
    durationMinutes,
    type,
    reason,
    status: 'pending'
  })
}

//-------------------------------------------------------
/**
 * Bác sĩ duyệt lịch hẹn + khởi tạo chat
 */
export const confirmAppointment = async (appointmentId, io) => {
  const appointment = await appointmentRepo.findById(appointmentId)
  if (!appointment)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Selected appointment not found',
      'APPOINTMENT_NOT_FOUND'
    )

  if (appointment.status !== 'pending')
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Selected appointment is not in pending status',
      'INVALID_STATUS'
    )

  // 1. Cập nhật status
  await appointmentRepo.update(appointmentId, { status: 'confirmed' })

  // 2. Đảm bảo quan hệ patient-doctor tồn tại
  await appointmentRepo.ensurePatientDoctor(
    appointment.patientId,
    appointment.doctorId
  )

  // 3. Tìm hoặc tạo conversation
  const { patientId, doctorId } = appointment
  let conversation = await Conversation.findOne({
    participants: { $all: [patientId, doctorId] }
  })

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [patientId, doctorId],
      unread_counts: {}
    })
  }

  // 4. Tạo tin nhắn hệ thống
  const systemContent =
    'Lịch hẹn đã được xác nhận. Bạn có thể trò chuyện với bác sĩ tại đây.'

  const message = await Message.create({
    conversation_id: conversation._id,
    sender_id: doctorId, // system message gắn với doctor context
    type: 'system_alert',
    content: {
      text: systemContent
    },
    status: 'sent'
  })

  // 5. Cập nhật last_message + unread_counts cho patient
  const currentUnread = conversation.unread_counts.get(String(patientId)) ?? 0
  conversation.last_message = {
    message_id: message._id,
    sender_id: doctorId,
    type: 'system_alert',
    content: systemContent,
    created_at: message.created_at
  }
  conversation.unread_counts.set(String(patientId), currentUnread + 1)
  await conversation.save()

  // 6. Emit socket event tới patient
  try {
    const ioInstance = io ?? socketService.getIo?.()
    if (ioInstance) {
      ioInstance.to(`patient:${patientId}`).emit('appointment:confirmed', {
        appointmentId,
        conversationId: conversation._id,
        message: systemContent
      })
    }
  } catch (_) {
    // Socket không critical, bỏ qua lỗi
  }

  return {
    appointment: await appointmentRepo.findById(appointmentId),
    conversation
  }
}
