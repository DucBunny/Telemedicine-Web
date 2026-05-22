import { StatusCodes } from 'http-status-codes'
import * as alertService from '@/services/alert.service'

/**
 * Get alerts by doctor ID
 */
export const getMyAlerts = async (req, res, next) => {
  try {
    const doctorId = req.user.id // from JWT token
    const {
      page = 1,
      limit = 10,
      search,
      status,
      handledBy,
      createdFrom,
      createdTo,
    } = req.validatedQuery
    const result = await alertService.getAlertsByDoctorId(doctorId, {
      page,
      limit,
      search,
      status,
      handledBy,
      createdFrom,
      createdTo,
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
 * GET /me/health-history — patient health events timeline
 */
export const getMyHealthHistory = async (req, res, next) => {
  try {
    const patientId = req.user.id
    const { page = 1, limit = 10 } = req.validatedQuery
    const result = await alertService.getHealthHistoryByPatientId(patientId, {
      page,
      limit,
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
 * PUT /alerts/:alertId/read
 */
export const markAlertAsRead = async (req, res, next) => {
  try {
    const doctorId = req.user.id
    const { alertId } = req.params
    const result = await alertService.markAlertAsRead(alertId, doctorId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /alerts/:alertId/handling
 */
export const claimAlertHandling = async (req, res, next) => {
  try {
    const doctorId = req.user.id
    const { alertId } = req.params
    const alert = await alertService.claimAlertHandling(alertId, doctorId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: alert,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /alerts/:alertId/release-handling — trả về pending nếu chưa resolve
 */
export const releaseAlertHandling = async (req, res, next) => {
  try {
    const doctorId = req.user.id
    const { alertId } = req.params
    const alert = await alertService.releaseAlertHandling(alertId, doctorId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: alert,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /alerts/:alertId/resolve
 */
export const resolveAlert = async (req, res, next) => {
  try {
    const doctorId = req.user.id
    const { alertId } = req.params
    const result = await alertService.resolveAlert(
      alertId,
      doctorId,
      req.body ?? {},
    )

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
