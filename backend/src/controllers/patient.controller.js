import { StatusCodes } from 'http-status-codes'
import * as patientService from '@/services/patient.service'

/**
 * Get patients by doctor ID
 */
export const getPatientsByDoctorId = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const { page = 1, limit = 10 } = req.query
    const result = await patientService.getPatientsByDoctorId(userId, {
      page,
      limit
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
 * Get current patient profile (for logged in patient)
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id // from JWT token
    const patient = await patientService.getPatientByUserId(userId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: patient
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create new patient
 */
// export const createPatient = async (req, res, next) => {
//   try {
//     const patient = await patientService.createPatient(req.body)

//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       data: patient
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /**
//  * Update patient
//  */
// export const updatePatient = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const patient = await patientService.updatePatient(id, req.body)

//     res.status(StatusCodes.OK).json({
//       success: true,
//       data: patient
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /**
//  * Delete patient
//  */
// export const deletePatient = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const result = await patientService.deletePatient(id)

//     res.status(StatusCodes.OK).json({
//       success: true,
//       data: result
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /**
//  * Get patient's devices
//  */
// export const getPatientDevices = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const devices = await patientService.getPatientDevices(id)

//     res.status(StatusCodes.OK).json({
//       success: true,
//       data: devices
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /**
//  * Get my devices (for logged in patient)
//  */
// export const getMyDevices = async (req, res, next) => {
//   try {
//     const userId = req.user.sub // from JWT token
//     const patient = await patientService.getPatientByUserId(userId)
//     const devices = await patientService.getPatientDevices(patient.id)

//     res.status(StatusCodes.OK).json({
//       success: true,
//       data: devices
//     })
//   } catch (error) {
//     next(error)
//   }
// }
