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
