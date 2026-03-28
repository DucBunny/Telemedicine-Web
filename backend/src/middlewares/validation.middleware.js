import ApiError from '@/utils/api-error'
import { StatusCodes } from 'http-status-codes'
import { fromError } from 'zod-validation-error'

/**
 * Formats Zod validation errors into a more readable structure.
 * @param {*} error
 * @returns {Object|null} An object mapping field paths to error messages, or null if no issues.
 * * @example
 * --- From (ZodError input): ---
 *  {
 *    issues: [
 *      { path: ['user', 'email'], message: 'Invalid email address', code: 'invalid_string', ... },
 *      { path: ['user', 'password'], message: 'Password must be at least 8 characters', ... }
 *    ]
 *  }
 *
 *  --- To (Returned output): ---
 *  {
 *    "user.email": "Invalid email address",
 *    "user.password": "Password must be at least 8 characters"
 *  }
 */
const formatZodError = (error) => {
  if (!error.issues) return null
  const details = {}
  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    details[path] = issue.message
  })
  return details
}

/**
 * Middleware to validate body, params, and query against Zod schemas.
 */
export function validate({ body, params, query }) {
  return (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body)

      if (params) req.params = params.parse(req.params)

      if (query) req.validatedQuery = query.parse(req.query) // Gán vào req.validatedQuery để tránh lỗi read-only (req.query là read-only)

      next()
    } catch (err) {
      const details = formatZodError(err)
      const message = fromError(err).message || 'Invalid input'
      next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          message,
          'VALIDATION_ERROR',
          details
        )
      )
    }
  }
}
