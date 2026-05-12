import { z } from 'zod'

/**
 * Common MySQL ID schema (int)
 */
export const intIdSchema = (errMessage = 'ID is invalid') =>
  z.coerce.number().int().positive(errMessage)

/**
 * Common MongoDB ObjectId schema (string)
 */
export const objectIdSchema = (
  errMessage = 'ID is must be a valid MongoDB ObjectId',
) => z.string().regex(/^[0-9a-fA-F]{24}$/, errMessage)

/**
 * Common pagination query schema
 * * Dùng cho các endpoint hỗ trợ pagination (page, limit)
 */
export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    nextCursor: z.string(), // Dùng cho cursor-based pagination
    limit: z.coerce.number().int().min(1).max(100).default(10),
  })
  .partial() // tất cả trường đều optional

/**
 * Common search query schema
 * * Dùng cho các endpoint hỗ trợ search (theo tên, email, v.v.)
 */
export const searchQuerySchema = z.object({
  search: z.string().optional(),
})

/**
 * Combined pagination and search schema
 * * Dùng cho các endpoint hỗ trợ cả pagination và search
 */
export const paginationWithSearchSchema = paginationQuerySchema.extend(
  searchQuerySchema.shape,
)

/**
 * Convert empty string query value to undefined before validating with schema.
 */
export const emptyStringToUndefined = (schema) =>
  z.preprocess((raw) => {
    if (raw == null) return undefined

    if (typeof raw === 'string') {
      const trimmed = raw.trim()
      return trimmed === '' ? undefined : trimmed
    }

    return raw
  }, schema)

/**
 * Convert empty string/array query value to undefined before validating with schema.
 * Useful for query params that accept both single string and array values.
 */
export const emptyStringOrArrayToUndefined = (schema) =>
  z.preprocess((raw) => {
    if (raw == null) return undefined

    if (Array.isArray(raw)) {
      const normalized = raw
        .map((value) => (typeof value === 'string' ? value.trim() : value))
        .filter((value) => value !== '')

      return normalized.length > 0 ? normalized : undefined
    }

    if (typeof raw === 'string') {
      const trimmed = raw.trim()
      return trimmed === '' ? undefined : trimmed
    }

    return raw
  }, schema)

/**
 * Date string schema
 */
export const datetimeStringSchema = z.iso.datetime('Datetime is invalid')

/**
 * Phone number schema (Vietnamese format)
 */
export const phoneNumberSchema = z
  .string()
  .regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, 'Phone number is invalid')

/**
 * Email schema
 */
export const emailSchema = z.string().email('Email is invalid')
