import { StatusCodes } from 'http-status-codes'
import * as medicalRecordService from '@/services/medicalRecord.service'

/**
 * Get medical records for the logged-in user (patient or doctor)
 */
export const getMyMedicalRecords = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user // from JWT token
    const { page = 1, limit = 10, search = '' } = req.validatedQuery
    const result = await medicalRecordService.getMyMedicalRecords(
      userId,
      role,
      {
        page,
        limit,
        search,
      },
    )
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
 * Get medical record detail by record ID
 */
export const getMedicalRecordDetail = async (req, res, next) => {
  try {
    const { recordId } = req.params
    const record = await medicalRecordService.getMedicalRecordById(recordId)
    res.status(StatusCodes.OK).json({
      success: true,
      data: record,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get medical records by patient ID and current doctor ID
 * GET /me/patients/:patientId/medical-records
 */
export const getMedicalRecordsByPatientIdAndCurrentDoctor = async (
  req,
  res,
  next,
) => {
  try {
    const doctorId = req.user.id // from JWT token
    const { patientId } = req.params
    const { page = 1, limit = 10, createdFrom, createdTo } = req.validatedQuery
    const result =
      await medicalRecordService.getMedicalRecordByPatientIdAndDoctorId(
        patientId,
        doctorId,
        { page, limit, createdFrom, createdTo },
      )
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
 * Create new medical record
 */
export const createMedicalRecord = async (req, res, next) => {
  try {
    const doctorId = req.user.id // from JWT token
    const data = req.body
    const record = await medicalRecordService.createMedicalRecord({
      ...data,
      doctorId,
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: record,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update medical record by ID
 */
export const updateMedicalRecord = async (req, res, next) => {
  try {
    const doctorId = req.user.id // from JWT token
    const { recordId } = req.params
    const data = req.body
    const updatedRecord = await medicalRecordService.updateMedicalRecord(
      recordId,
      {
        ...data,
        doctorId,
      },
    )
    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedRecord,
    })
  } catch (error) {
    next(error)
  }
}
