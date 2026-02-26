import * as doctorRepo from '@/repositories/doctor.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

/**
 * Get doctor by user ID
 */
export const getDoctorByUserId = async (userId) => {
  const doctor = await doctorRepo.findByUserId(userId)
  if (!doctor) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Doctor not found',
      'DOCTOR_NOT_FOUND'
    )
  }
  return doctor
}
