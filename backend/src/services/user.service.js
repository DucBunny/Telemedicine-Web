import * as userRepo from '@/repositories/user.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

export const getAllUsers = async ({ page, limit, search, role }) => {
  return await userRepo.getAll({ page, limit, search, role })
}

export const getUserById = async (id) => {
  const user = await userRepo.findById(id)
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
  const user = await userRepo.updateStatus(id, status)
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
