import * as appointmentRepo from '@/repositories/appointment.repo'
import Conversation from '@/models/nosql/conversation'
import Message from '@/models/nosql/message'
import * as socketService from '@/services/socket.service'
import ApiError from '@/utils/api-error'
import { StatusCodes } from 'http-status-codes'

export const getAppointmentsByDoctorId = async (
  doctorId,
  { page = 1, limit = 10, status = [] }
) => {
  return await appointmentRepo.findByDoctorId(doctorId, {
    page,
    limit,
    status
  })
}

export const getAppointmentsByPatientId = async (
  patientId,
  { page = 1, limit = 10, status = [] }
) => {
  return await appointmentRepo.findByPatientId(patientId, {
    page,
    limit,
    status
  })
}

/**
 * Tạo các slot 30 phút trong khoảng [startTime, endTime)
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

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Kiểm tra slot bị block bởi off schedule hoặc appointment đã đặt
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
    const apptDate = new Date(appt.scheduledAt)
    const apptStart = apptDate.getUTCHours() * 60 + apptDate.getUTCMinutes()
    const apptEnd = apptStart + (appt.duration ?? 30)
    if (slotStart < apptEnd && slotEnd > apptStart) return false
  }

  return true
}

/**
 * Lấy danh sách slot trống của bác sĩ theo ngày
 */
export const getAvailableSlots = async (doctorId, date) => {
  const dateObj = new Date(date)
  const dayOfWeek = dateObj.getDay() // 0=Sun, 1=Mon...

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
 * Đặt lịch hẹn mới
 */
export const bookAppointment = async ({
  patientId,
  doctorId,
  scheduledAt,
  reason,
  duration = 30
}) => {
  // Kiểm tra slot có còn trống không
  const dateStr = new Date(scheduledAt).toISOString().split('T')[0]
  const slotTime = new Date(scheduledAt).toISOString().split('T')[1].slice(0, 5)

  const available = await getAvailableSlots(doctorId, dateStr)
  if (!available.includes(slotTime)) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Khung giờ này đã bị đặt hoặc không nằm trong giờ làm việc của bác sĩ.',
      'SLOT_NOT_AVAILABLE'
    )
  }

  return await appointmentRepo.bookAppointment({
    patientId,
    doctorId,
    scheduledAt,
    reason,
    duration
  })
}

/**
 * Bác sĩ duyệt lịch hẹn + khởi tạo chat
 */
export const confirmAppointment = async (appointmentId, io) => {
  const appointment = await appointmentRepo.findById(appointmentId)
  if (!appointment) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Không tìm thấy lịch hẹn.',
      'APPOINTMENT_NOT_FOUND'
    )
  }
  if (appointment.status !== 'pending') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Lịch hẹn không ở trạng thái chờ duyệt.',
      'INVALID_STATUS'
    )
  }

  // 1. Cập nhật status
  await appointmentRepo.updateStatus(appointmentId, 'confirmed')

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
