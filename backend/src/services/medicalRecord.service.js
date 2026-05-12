import { StatusCodes } from 'http-status-codes'
import * as medicalRecordRepo from '@/repositories/medicalRecord.repo'
import ApiError from '@/utils/api-error'

/**
 * Get medical records for logged in user (doctor or patient) with pagination
 */
export const getMyMedicalRecords = async (
  userId,
  role,
  { page, limit, search },
) => {
  if (role === 'doctor') {
    return await medicalRecordRepo.findByDoctorId(userId, {
      page,
      limit,
    })
  } else if (role === 'patient') {
    return await medicalRecordRepo.findByPatientId(userId, {
      page,
      limit,
      search,
    })
  }
}

/**
 * Get medical record by ID
 */
export const getMedicalRecordById = async (recordId) => {
  const record = await medicalRecordRepo.findById(recordId)
  if (!record) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Medical record not found',
      'RECORD_NOT_FOUND',
    )
  }
  return record
}

/**
 * Get medical records by patient ID and doctor ID
 */
export const getMedicalRecordByPatientIdAndDoctorId = async (
  patientId,
  doctorId,
  { page, limit, createdFrom, createdTo },
) => {
  return await medicalRecordRepo.findByPatientIdAndDoctorId(
    patientId,
    doctorId,
    { page, limit, createdFrom, createdTo },
  )
}
