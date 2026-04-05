import * as patientRepo from '@/repositories/patient.repo'
import * as userRepo from '@/repositories/user.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'
import { sequelize } from '@/models/sql'

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
  if (!patient)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Patient not found',
      'PATIENT_NOT_FOUND'
    )
  return patient
}

/**
 * Update patient
 */
export const updatePatient = async (id, { user: userData, ...data }) => {
  return await sequelize.transaction(async (t) => {
    let user = null
    if (userData)
      user = await userRepo.update(id, userData, {
        transaction: t
      })

    const patient = await patientRepo.update(id, data, {
      transaction: t
    })

    if (!patient || (userData && !user))
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Patient not found',
        'PATIENT_NOT_FOUND'
      )

    return patient
  })
}

// ---------------------------------------

/**
 * Get all patients with pagination
 */
export const getAllPatients = async ({ page, limit, search }) => {
  return await patientRepo.getAll({ page, limit, search })
}

/**
 * Create new patient
 */
export const createPatient = async (data) => {
  return await patientRepo.create(data)
}

/**
 * Update patient by user ID (for logged in patient)
 */
export const updatePatientByUserId = async (userId, data) => {
  const patient = await patientRepo.updateByUserId(userId, data)
  if (!patient) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Patient not found',
      'PATIENT_NOT_FOUND'
    )
  }
  return patient
}

/**
 * Delete patient
 */
export const deletePatient = async (id) => {
  const result = await patientRepo.deletePatient(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Patient not found',
      'PATIENT_NOT_FOUND'
    )
  }
  return { message: 'Patient deleted successfully' }
}

/**
 * Get patient's devices
 */
export const getPatientDevices = async (patientId) => {
  return await patientRepo.getPatientDevices(patientId)
}
