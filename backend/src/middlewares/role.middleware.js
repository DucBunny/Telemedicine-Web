import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to access this resource',
        'FORBIDDEN'
      )
    }
    next()
  }
}
