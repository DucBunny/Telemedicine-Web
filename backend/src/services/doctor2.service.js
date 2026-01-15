import * as doctorRepo from '@/repositories/doctor2.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

/**
 * Get all doctors with pagination
 */
export const getAllDoctors = async ({ page, limit, search }) => {
  return await doctorRepo.getAll({ page, limit, search })
}

/**
 * Get doctor by ID
 */
export const getDoctorById = async (id) => {
  const doctor = await doctorRepo.findById(id)
  if (!doctor) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Doctor not found',
      'DOCTOR_NOT_FOUND'
    )
  }
  return doctor
}

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

/**
 * Create new doctor
 */
export const createDoctor = async (data) => {
  return await doctorRepo.create(data)
}

/**
 * Update doctor
 */
export const updateDoctor = async (id, data) => {
  const doctor = await doctorRepo.update(id, data)
  if (!doctor) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Doctor not found',
      'DOCTOR_NOT_FOUND'
    )
  }
  return doctor
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
      'DOCTOR_NOT_FOUND'
    )
  }
  return { message: 'Doctor deleted successfully' }
}

/**
 * Get doctor's patients
 */
export const getDoctorPatients = async (doctorId, { page, limit }) => {
  const result = await doctorRepo.getDoctorPatients(doctorId, { page, limit })
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Doctor not found',
      'DOCTOR_NOT_FOUND'
    )
  }
  return result
}
