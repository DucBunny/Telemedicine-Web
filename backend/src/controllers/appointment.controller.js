import * as appointmentService from '@/services/appointment.service'
import { StatusCodes } from 'http-status-codes'
import { normalizeQueryArray } from '@/utils/normalize-query-array'

/**
 * Get appointments for logged in user (doctor or patient) with filter
 */
export const getMyAppointments = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    const { page = 1, limit = 10 } = req.validatedQuery
    const rawStatus =
      req.validatedQuery.status ?? req.validatedQuery['status[]'] ?? []
    const normalizedStatus = normalizeQueryArray(rawStatus)

    const result = await appointmentService.getMyAppointments(userId, role, {
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
 * Cancel appointment (by doctor or patient)
 */
export const cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params
    const { role } = req.user
    const { cancelReason } = req.body
    const result = await appointmentService.cancelAppointment(
      appointmentId,
      { cancelReason },
      role
    )
    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get available slots for a doctor on a specific date
 * GET /appointments/available-slots?doctorId=&date=YYYY-MM-DD
 */
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.validatedQuery
    const slots = await appointmentService.getAvailableSlots(doctorId, date)
    res.status(StatusCodes.OK).json({
      success: true,
      data: slots
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /appointments
 * Body: { doctorId, scheduledAt, durationMinutes?, type, reason }
 */
export const createAppointment = async (req, res, next) => {
  try {
    const patientId = req.user.id
    const { doctorId, scheduledAt, durationMinutes, type, reason } = req.body

    const appointment = await appointmentService.createAppointment({
      patientId,
      doctorId,
      scheduledAt,
      durationMinutes,
      type,
      reason
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: appointment
    })
  } catch (error) {
    next(error)
  }
}

//-------------------------------------------------------
/**
 * POST /appointments/:appointmentId/confirm  (Doctor/Admin)
 */
export const confirmAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params
    const result = await appointmentService.confirmAppointment(
      appointmentId,
      req.io
    )
    res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
