import { StatusCodes } from 'http-status-codes'
import * as appointmentService from '@/services/appointment.service'
import { normalizeQueryArray } from '@/utils/normalize-query-array'

/**
 * Get appointments for logged in user (doctor or patient) with filter
 */
export const getMyAppointments = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    const {
      page = 1,
      limit = 10,
      type,
      scheduledFrom,
      scheduledTo,
      search,
    } = req.validatedQuery
    const rawStatus =
      req.validatedQuery.status ?? req.validatedQuery['status[]'] ?? []
    const normalizedStatus = normalizeQueryArray(rawStatus)

    const result = await appointmentService.getMyAppointments(userId, role, {
      page,
      limit,
      status: normalizedStatus,
      type,
      scheduledFrom,
      scheduledTo,
      search,
    })
    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get patient's appointments for current doctor
 * GET /me/patients/:patientId/appointments
 */
export const getAppointmentByPatientIdAndCurrentDoctor = async (
  req,
  res,
  next,
) => {
  try {
    const doctorId = req.user.id
    const { patientId } = req.params
    const {
      page = 1,
      limit = 10,
      type,
      scheduledFrom,
      scheduledTo,
    } = req.validatedQuery
    const rawStatus =
      req.validatedQuery.status ?? req.validatedQuery['status[]'] ?? []
    const normalizedStatus = normalizeQueryArray(rawStatus)
    const result =
      await appointmentService.getAppointmentByPatientIdAndDoctorId(
        patientId,
        doctorId,
        {
          page,
          limit,
          status: normalizedStatus,
          type,
          scheduledFrom,
          scheduledTo,
        },
      )
    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta,
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
    const { id: actorId, role } = req.user
    const { cancelReason } = req.body
    const result = await appointmentService.cancelAppointment(
      appointmentId,
      { cancelReason },
      actorId,
      role,
    )
    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
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
    const { date } = req.validatedQuery
    const doctorId =
      req.user.role === 'doctor' ? req.user.id : req.validatedQuery.doctorId
    const slots = await appointmentService.getAvailableSlots(doctorId, date)
    res.status(StatusCodes.OK).json({
      success: true,
      data: slots,
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
    const { role } = req.user
    const patientId = role === 'patient' ? req.user.id : req.body.patientId
    const doctorId = role === 'doctor' ? req.user.id : req.body.doctorId
    const { scheduledAt, durationMinutes, type, reason } = req.body

    const appointment = await appointmentService.createAppointment({
      patientId,
      doctorId,
      scheduledAt,
      durationMinutes,
      type,
      reason,
      initiatedBy: role,
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /appointments/:appointmentId/confirm  (Doctor)
 */
export const confirmAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params
    const { id: actorId } = req.user
    const result = await appointmentService.confirmAppointment(
      appointmentId,
      actorId,
    )
    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /appointments/:appointmentId/status (Doctor)
 */
export const patchAppointmentStatusByDoctor = async (req, res, next) => {
  try {
    const { appointmentId } = req.params
    const doctorId = req.user.id
    const { status, cancelReason } = req.body
    const result = await appointmentService.patchAppointmentStatusByDoctor(
      appointmentId,
      doctorId,
      { status, cancelReason },
    )
    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
