import { StatusCodes } from 'http-status-codes'
import * as doctorService from '@/services/doctor2.service'

/**
 * Get all doctors
 */
export const getAllDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const result = await doctorService.getAllDoctors({ page, limit, search })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get doctor by ID
 */
export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params
    const doctor = await doctorService.getDoctorById(id)

    res.status(StatusCodes.OK).json({
      success: true,
      data: doctor
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get current doctor profile (for logged in doctor)
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.sub // from JWT token
    const doctor = await doctorService.getDoctorByUserId(userId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: doctor
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create new doctor
 */
export const createDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctor(req.body)

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: doctor
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update doctor
 */
export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params
    const doctor = await doctorService.updateDoctor(id, req.body)

    res.status(StatusCodes.OK).json({
      success: true,
      data: doctor
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete doctor
 */
export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await doctorService.deleteDoctor(id)

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get doctor's patients
 */
export const getDoctorPatients = async (req, res, next) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 10 } = req.query
    const result = await doctorService.getDoctorPatients(id, { page, limit })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get my patients (for logged in doctor)
 */
export const getMyPatients = async (req, res, next) => {
  try {
    const userId = req.user.sub // from JWT token
    const doctor = await doctorService.getDoctorByUserId(userId)
    const { page = 1, limit = 10 } = req.query
    const result = await doctorService.getDoctorPatients(doctor.id, {
      page,
      limit
    })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.pagination
    })
  } catch (error) {
    next(error)
  }
}
