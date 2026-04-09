import { StatusCodes } from 'http-status-codes'
import * as doctorService from '@/services/doctor.service'

/**
 * Get all doctors
 */
export const getAllDoctors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      specialtyId
    } = req.validatedQuery
    const result = await doctorService.getAllDoctors({
      page,
      limit,
      search,
      specialtyId
    })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get doctor detail by user ID
 */
export const getDoctorDetail = async (req, res, next) => {
  try {
    const { doctorId } = req.params
    const doctor = await doctorService.getDoctorByUserId(doctorId)
    res.status(StatusCodes.OK).json({
      success: true,
      data: doctor
    })
  } catch (error) {
    next(error)
  }
}

//---------------------------------------

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
    const { doctorId } = req.params
    const doctor = await doctorService.updateDoctor(doctorId, req.body)

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
    const { doctorId } = req.params
    const result = await doctorService.deleteDoctor(doctorId)

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
    const { doctorId } = req.params
    const { page = 1, limit = 10 } = req.query
    const result = await doctorService.getDoctorPatients(doctorId, {
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

/**
 * Get my patients (for logged in doctor)
 */
export const getMyPatients = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
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
