import * as medicalRecordService from '@/services/medicalRecord.service'
import { StatusCodes } from 'http-status-codes'

export const getMedicalRecordsByDoctorId = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { page = 1, limit = 10 } = req.query
    const result = await medicalRecordService.getMedicalRecordsByDoctorId(
      userId,
      {
        page,
        limit
      }
    )
    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

export const getMedicalRecordsByPatientId = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { page = 1, limit = 10 } = req.query
    const result = await medicalRecordService.getMedicalRecordsByPatientId(
      userId,
      {
        page,
        limit
      }
    )
    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}
