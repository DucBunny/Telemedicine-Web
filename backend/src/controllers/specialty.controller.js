import { StatusCodes } from 'http-status-codes'
import * as specialtyService from '@/services/specialty.service'

/**
 * Get all specialties
 */
export const getAllSpecialties = async (req, res, next) => {
  try {
    const specialties = await specialtyService.getAllSpecialties()
    res.status(StatusCodes.OK).json({
      success: true,
      data: specialties
    })
  } catch (error) {
    next(error)
  }
}
