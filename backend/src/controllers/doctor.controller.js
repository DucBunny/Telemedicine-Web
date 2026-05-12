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
      specialtyId,
    } = req.validatedQuery
    const result = await doctorService.getAllDoctors({
      page,
      limit,
      search,
      specialtyId,
    })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta,
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
      data: doctor,
    })
  } catch (error) {
    next(error)
  }
}
