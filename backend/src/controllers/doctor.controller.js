import { StatusCodes } from 'http-status-codes'
import * as doctorService from '@/services/doctor.service'

/**
 * Get current doctor profile (for logged in doctor)
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const doctor = await doctorService.getDoctorByUserId(userId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: doctor
    })
  } catch (error) {
    next(error)
  }
}
