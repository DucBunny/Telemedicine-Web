import { StatusCodes } from 'http-status-codes'
import * as statsService from '@/services/stats.service'

export const getDashboardStats = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    let stats
    if (role === 'admin') {
      stats = await statsService.getSystemStats()
    } else if (role === 'doctor') {
      stats = await statsService.getDoctorStats(userId)
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}
