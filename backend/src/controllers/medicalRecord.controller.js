import * as medicalRecordService from '@/services/medicalRecord.service'
import { StatusCodes } from 'http-status-codes'

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
        search
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

export const getMedicalRecordDetail = async (req, res, next) => {
  try {
    const { recordId } = req.params
    const record = await medicalRecordService.getMedicalRecordById(recordId)
    res.status(StatusCodes.OK).json({
      success: true,
      data: record
    })
  } catch (error) {
    next(error)
  }
}

//-----------------------------------------

export const createMedicalRecord = async (req, res, next) => {
  try {
    const record = await medicalRecordService.createMedicalRecord(req.body)
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: record
    })
  } catch (error) {
    next(error)
  }
}

export const updateMedicalRecord = async (req, res, next) => {
  try {
    const { id } = req.params
    const record = await medicalRecordService.updateMedicalRecord(id, req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      data: record
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMedicalRecord = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await medicalRecordService.deleteMedicalRecord(id)
    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
