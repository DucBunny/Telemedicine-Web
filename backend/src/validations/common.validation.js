import { z } from 'zod'

/**
 * Common ID parameter schema (UUID)
 */
export const idParamSchema = z.object({
  // id: z.string().uuid('ID không hợp lệ')
  id: z.coerce.number().int().positive('ID is invalid')
})

/**
 * Common pagination query schema
 * * Dùng cho các endpoint hỗ trợ pagination (page, limit)
 */
export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    nextCursor: z.string(), // Dùng cho cursor-based pagination
    limit: z.coerce.number().int().min(1).max(100).default(10)
  })
  .partial() // tất cả trường đều optional

/**
 * Common search query schema
 * * Dùng cho các endpoint hỗ trợ search (theo tên, email, v.v.)
 */
export const searchQuerySchema = z.object({
  search: z.string().optional()
})

/**
 * Combined pagination and search schema
 * * Dùng cho các endpoint hỗ trợ cả pagination và search
 */
export const paginationWithSearchSchema = paginationQuerySchema.extend(
  searchQuerySchema.shape
)

/**
 * Date string schema
 */
export const datetimeStringSchema = z.iso.datetime('Date is invalid')

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
