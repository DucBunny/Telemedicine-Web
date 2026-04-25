import { StatusCodes } from 'http-status-codes'
import { sequelize } from '@/models/sql'
import * as patientRepo from '@/repositories/patient.repo'
import * as userRepo from '@/repositories/user.repo'
import ApiError from '@/utils/api-error'

/**
 * Get patient by user ID
 */
export const getPatientByUserId = async (userId) => {
  const patient = await patientRepo.findByUserId(userId)
  if (!patient)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Patient not found',
      'PATIENT_NOT_FOUND',
    )
  return patient
}

/**
 * Update patient
 */
export const updatePatient = async (id, { user: userData, ...data }) => {
  return await sequelize.transaction(async (t) => {
    let user = null
    if (userData) {
      if (userData.email) {
        // Check if email is already in use by another user
        const existingEmail = await userRepo.findByEmail(userData.email)
        if (existingEmail && existingEmail.id !== id)
          throw new ApiError(
            StatusCodes.CONFLICT,
            'Email already exists',
            'EMAIL_EXISTS',
          )
      }

      if (userData.phoneNumber) {
        // Check if phone is already in use by another user
        const existingPhone = await userRepo.findByPhoneNumber(
          userData.phoneNumber,
        )
        if (existingPhone && existingPhone.id !== id)
          throw new ApiError(
            StatusCodes.CONFLICT,
            'Phone number already exists',
            'PHONE_NUMBER_EXISTS',
          )
      }

      user = await userRepo.update(id, userData, {
        transaction: t,
      })
    }

    const patient = await patientRepo.update(id, data, {
      transaction: t,
    })

    if (!patient || (userData && !user))
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Patient not found',
        'PATIENT_NOT_FOUND',
      )

    return patient
  })
}

/**
 * Get patients by doctor ID
 */
export const getPatientsByDoctorId = async (doctorId, { page, limit }) => {
  return await patientRepo.findByDoctorId(doctorId, { page, limit })
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
 * Delete patient
 */
export const deletePatient = async (id) => {
  const result = await patientRepo.deletePatient(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Patient not found',
      'PATIENT_NOT_FOUND',
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
