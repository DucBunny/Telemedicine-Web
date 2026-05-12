import { StatusCodes } from 'http-status-codes'
import * as patientService from '@/services/patient.service'

/**
 * Get patients by doctor ID
 */
export const getMyPatients = async (req, res, next) => {
  try {
    const doctorId = req.user.id // from JWT token
    const {
      page = 1,
      limit = 10,
      search,
      bloodType,
      gender,
      dobFrom,
      dobTo,
    } = req.validatedQuery
    const result = await patientService.getPatientsByDoctorId(doctorId, {
      page,
      limit,
      search,
      bloodType,
      gender,
      dobFrom,
      dobTo,
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
 * Get patient detail by user ID
 */
export const getPatientDetail = async (req, res, next) => {
  try {
    const { patientId } = req.params
    const patient = await patientService.getPatientByUserId(patientId)
    res.status(StatusCodes.OK).json({
      success: true,
      data: patient,
    })
  } catch (error) {
    next(error)
  }
}
