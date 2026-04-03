import * as userRepo from '@/repositories/user.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'
import { comparePassword, hashPassword } from '@/utils/hash-password'

/**
 * Change user password
 */
export const changeUserPassword = async (id, currentPassword, newPassword) => {
  const user = await userRepo.findById(id)
  if (!user)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'User not found',
      'USER_NOT_FOUND'
    )

  const isMatch = await comparePassword(currentPassword, user.password)
  if (!isMatch)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Current password is incorrect',
      'INCORRECT_PASSWORD'
    )

  return await userRepo.update(id, {
    password: await hashPassword(newPassword)
  })
}

//---------------------------------------
/**
 * Get all users with pagination and search
 */
export const getAllUsers = async ({ page, limit, search, role }) => {
  return await userRepo.getAll({ page, limit, search, role })
}

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  const user = await userRepo.findByIdExcludePassword(id)
  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'User not found',
      'USER_NOT_FOUND'
    )
  }
  return user
}

export const updateUserStatus = async (id, status) => {
  const user = await userRepo.update(id, { status })
  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'User not found',
      'USER_NOT_FOUND'
    )
  }
  return user
}

export const deleteUser = async (id) => {
  const result = await userRepo.deleteById(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'User not found',
      'USER_NOT_FOUND'
    )
  }
  return result
}
