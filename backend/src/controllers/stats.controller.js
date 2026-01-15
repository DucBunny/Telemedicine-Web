import { StatusCodes } from 'http-status-codes'
import * as statsService from '@/services/stats.service'

export const getSystemStats = async (req, res, next) => {
  try {
    const stats = await statsService.getSystemStats()
    res.status(StatusCodes.OK).json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
}

export const getDoctorStats = async (req, res, next) => {
  try {
    const doctorId = req.user.id
    const stats = await statsService.getDoctorStats(doctorId)
    res.status(StatusCodes.OK).json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
}
