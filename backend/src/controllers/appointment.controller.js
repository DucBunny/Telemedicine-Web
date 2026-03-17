import * as appointmentService from '@/services/appointment.service'
import { StatusCodes } from 'http-status-codes'
import { normalizeQueryArray } from '@/utils/normalize-query-array'

export const getAppointmentsByDoctorId = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { page = 1, limit = 10 } = req.query
    const rawStatus = req.query.status ?? req.query['status[]'] ?? []
    const normalizedStatus = normalizeQueryArray(rawStatus)

    const result = await appointmentService.getAppointmentsByDoctorId(userId, {
      page,
      limit,
      status: normalizedStatus
    })
    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

export const getAppointmentsByPatientId = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { page = 1, limit = 10 } = req.query
    const rawStatus = req.query.status ?? req.query['status[]'] ?? []
    const normalizedStatus = normalizeQueryArray(rawStatus)

    const result = await appointmentService.getAppointmentsByPatientId(userId, {
      page,
      limit,
      status: normalizedStatus
    })
    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /appointments/available-slots?doctor_id=&date=YYYY-MM-DD
 */
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctor_id, date } = req.query
    if (!doctor_id || !date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Thiếu tham số doctor_id hoặc date.'
      })
    }

    const slots = await appointmentService.getAvailableSlots(
      parseInt(doctor_id),
      date
    )
    res.status(StatusCodes.OK).json({ success: true, data: slots })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /appointments/book
 * Body: { doctor_id, scheduled_at, reason, duration? }
 */
export const bookAppointment = async (req, res, next) => {
  try {
    const patientId = req.user.id
    const { doctor_id, scheduled_at, reason, duration } = req.body

    if (!doctor_id || !scheduled_at) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Thiếu tham số doctor_id hoặc scheduled_at.'
      })
    }

    const appointment = await appointmentService.bookAppointment({
      patientId,
      doctorId: parseInt(doctor_id),
      scheduledAt: scheduled_at,
      reason,
      duration
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: appointment
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /appointments/:id/confirm  (Doctor/Admin)
 */
export const confirmAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await appointmentService.confirmAppointment(
      parseInt(id),
      req.io
    )
    res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
