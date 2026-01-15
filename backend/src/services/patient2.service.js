import * as patientRepo from '@/repositories/patient2.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

/**
 * Get all patients with pagination
 */
export const getAllPatients = async ({ page, limit, search }) => {
  return await patientRepo.getAll({ page, limit, search })
}

/**
 * Get patient by ID
 */
export const getPatientById = async (id) => {
  const patient = await patientRepo.findById(id)
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

/**
 * Create new patient
 */
export const createPatient = async (data) => {
  return await patientRepo.create(data)
}

/**
 * Update patient
 */
export const updatePatient = async (id, data) => {
  const patient = await patientRepo.update(id, data)
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
