import { z } from 'zod'
import {
  idParamSchema,
  paginationWithSearchSchema,
  paginationQuerySchema
} from '@/validations/common.validation'

/**
 * Get all doctors query schema
 */
export const getAllDoctorsQuerySchema = paginationWithSearchSchema
  .extend({
    specialtyId: z.coerce.number().int().positive('Specialty ID is invalid'),
    search: z.string()
  })
  .partial() // tất cả trường đều optional

/**
 * Get doctor by ID param schema
 */
export const getDoctorByIdParamSchema = idParamSchema

//------------------------------
/**
 * Get doctor patients query schema
 */
export const getDoctorPatientsQuerySchema = paginationQuerySchema

/**
 * Create doctor body schema
 */
export const createDoctorSchema = z.object({
  userId: z.string().uuid('User ID không hợp lệ'),
  specialtyId: z.coerce
    .number()
    .int()
    .positive('Specialty ID is invalid')
    .optional(),
  degree: z.string().min(1, 'Bằng cấp không được để trống').optional(),
  experienceYears: z.coerce
    .number()
    .int()
    .min(0, 'Số năm kinh nghiệm không hợp lệ')
    .optional(),
  bio: z
    .string()
    .max(1000, 'Tiểu sử không được vượt quá 1000 ký tự')
    .optional(),
  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional()
})

/**
 * Update doctor body schema
 */
export const updateDoctorSchema = z.object({
  specialtyId: z.coerce
    .number()
    .int()
    .positive('Specialty ID is invalid')
    .optional(),
  degree: z.string().min(1, 'Bằng cấp không được để trống').optional(),
  experienceYears: z.coerce
    .number()
    .int()
    .min(0, 'Số năm kinh nghiệm không hợp lệ')
    .optional(),
  bio: z
    .string()
    .max(1000, 'Tiểu sử không được vượt quá 1000 ký tự')
    .optional(),
  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional()
})
