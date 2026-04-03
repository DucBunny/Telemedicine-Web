import * as userService from '@/services/user.service'
import * as doctorService from '@/services/doctor.service'
import * as patientService from '@/services/patient.service'
import { StatusCodes } from 'http-status-codes'

/**
 * Get my profile for logged in user
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    let profile
    if (role === 'doctor') {
      profile = await doctorService.getDoctorByUserId(userId)
    } else if (role === 'patient') {
      profile = await patientService.getPatientByUserId(userId)
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: profile
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update my profile for logged in user
 */
export const updateMyProfile = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    let updatedProfile
    if (role === 'doctor') {
      updatedProfile = await doctorService.updateDoctor(userId, req.body)
    } else if (role === 'patient') {
      updatedProfile = await patientService.updatePatient(userId, req.body)
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedProfile
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Change password for logged in user
 */
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body
    await userService.changeUserPassword(userId, currentPassword, newPassword)

    res.status(StatusCodes.OK).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}

//---------------------------------------

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query
    const result = await userService.getAllUsers({ page, limit, search, role })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await userService.getUserById(id)
    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const user = await userService.updateUserStatus(id, status)

    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await userService.deleteUser(id)

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
