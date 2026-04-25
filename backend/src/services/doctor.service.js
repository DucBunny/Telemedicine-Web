import { StatusCodes } from 'http-status-codes'
import { sequelize } from '@/models/sql'
import * as doctorRepo from '@/repositories/doctor.repo'
import * as userRepo from '@/repositories/user.repo'
import ApiError from '@/utils/api-error'

/**
 * Get doctor by user ID
 */
export const getDoctorByUserId = async (userId) => {
  const doctor = await doctorRepo.findByUserId(userId)
  if (!doctor)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Doctor not found',
      'DOCTOR_NOT_FOUND',
    )

  return doctor
}

/**
 * Get all doctors with pagination
 */
export const getAllDoctors = async ({ page, limit, search, specialtyId }) => {
  return await doctorRepo.getAll({ page, limit, search, specialtyId })
}

/**
 * Update doctor
 */
export const updateDoctor = async (id, { user: userData, ...data }) => {
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

    const doctor = await doctorRepo.update(id, data, {
      transaction: t,
    })

    if (!doctor || (userData && !user))
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Doctor not found',
        'DOCTOR_NOT_FOUND',
      )

    return doctor
  })
}
//---------------------------------------

/**
 * Create new doctor
 */
export const createDoctor = async (data) => {
  return await doctorRepo.create(data)
}

/**
 * Delete doctor
 */
export const deleteDoctor = async (id) => {
  const result = await doctorRepo.deleteDoctor(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Doctor not found',
      'DOCTOR_NOT_FOUND',
    )
  }
  return { message: 'Doctor deleted successfully' }
}
