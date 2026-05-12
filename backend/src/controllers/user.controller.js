import { StatusCodes } from 'http-status-codes'
import { getMultipleUsersStatus } from '@/cache/presence.cache'
import * as doctorService from '@/services/doctor.service'
import * as patientService from '@/services/patient.service'
import * as patientDoctorService from '@/services/patientDoctor.service'
import * as userService from '@/services/user.service'

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
      data: profile,
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
      data: updatedProfile,
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
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get presence status of related users (doctors <-> patients) for logged in user
 */
export const getMyRelatedUsersPresence = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    const relatedUserIds = await patientDoctorService.getRelatedUserIds(
      userId,
      role,
    )
    const statuses = await getMultipleUsersStatus(relatedUserIds)

    res.status(StatusCodes.OK).json({
      success: true,
      data: statuses,
    })
  } catch (error) {
    next(error)
  }
}
