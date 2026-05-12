import { StatusCodes } from 'http-status-codes'
import * as userRepo from '@/repositories/user.repo'
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
      'USER_NOT_FOUND',
    )

  const isMatch = await comparePassword(currentPassword, user.password)
  if (!isMatch)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Current password is incorrect',
      'INCORRECT_PASSWORD',
    )

  return await userRepo.update(id, {
    password: await hashPassword(newPassword),
  })
}
