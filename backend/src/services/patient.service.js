import * as patientRepo from '@/repositories/patient.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

/**
 * Get patients by doctor ID
 */
export const getPatientsByDoctorId = async (
  doctorId,
  { page = 1, limit = 10 }
) => {
  return await patientRepo.findByDoctorId(doctorId, { page, limit })
}

/**
 * Get patient by user ID
 */
export const getPatientByUserId = async (userId) => {
  const patient = await patientRepo.findByUserId(userId)
  if (!patient) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Patient not found',
      'PATIENT_NOT_FOUND'
    )
  }
  return patient
}
