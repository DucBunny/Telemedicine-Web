import { z } from 'zod'
import {
  idParamSchema,
  paginationWithSearchSchema,
  optionalDateStringSchema,
  optionalPhoneNumberSchema
} from '@/validations/common.validation'

/**
 * Gender enum
 */
const genderEnum = z.enum(['male', 'female', 'other'], {
  errorMap: () => ({ message: 'Giới tính không hợp lệ' })
})

/**
 * Blood type enum
 */
const bloodTypeEnum = z.enum(
  ['A', 'B', 'AB', 'O', 'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
  {
    errorMap: () => ({ message: 'Nhóm máu không hợp lệ' })
  }
)

/**
 * Health status enum
 */
const healthStatusEnum = z.enum(['stable', 'monitoring', 'critical'], {
  errorMap: () => ({ message: 'Trạng thái sức khỏe không hợp lệ' })
})

/**
 * Get all patients query schema
 */
export const getAllPatientsQuerySchema = paginationWithSearchSchema

/**
 * Get patient by ID param schema
 */
export const getPatientByIdParamSchema = idParamSchema

/**
 * Create patient body schema
 */
export const createPatientSchema = z.object({
  userId: z.string().uuid('User ID không hợp lệ'),
  dateOfBirth: optionalDateStringSchema,
  gender: genderEnum.optional(),
  bloodType: bloodTypeEnum.optional(),
  height: z.coerce.number().positive('Chiều cao phải là số dương').optional(),
  weight: z.coerce.number().positive('Cân nặng phải là số dương').optional(),
  medicalHistory: z
    .string()
    .max(2000, 'Tiền sử bệnh không được vượt quá 2000 ký tự')
    .optional(),
  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional(),
  currentHealthStatus: healthStatusEnum.optional(),
  currentIssue: z
    .string()
    .max(1000, 'Vấn đề hiện tại không được vượt quá 1000 ký tự')
    .optional()
})

/**
 * Update patient body schema (for admin)
 */
export const updatePatientSchema = z.object({
  dateOfBirth: optionalDateStringSchema,
  gender: genderEnum.optional(),
  bloodType: bloodTypeEnum.optional(),
  height: z.coerce.number().positive('Chiều cao phải là số dương').optional(),
  weight: z.coerce.number().positive('Cân nặng phải là số dương').optional(),
  medicalHistory: z
    .string()
    .max(2000, 'Tiền sử bệnh không được vượt quá 2000 ký tự')
    .optional(),
  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional(),
  currentHealthStatus: healthStatusEnum.optional(),
  currentIssue: z
    .string()
    .max(1000, 'Vấn đề hiện tại không được vượt quá 1000 ký tự')
    .optional()
})

/**
 * Update patient profile schema (for logged in patient)
 */
export const updatePatientProfileSchema = z.object({
  dateOfBirth: optionalDateStringSchema,
  gender: genderEnum.optional(),
  bloodType: bloodTypeEnum.optional(),
  height: z.coerce.number().positive('Chiều cao phải là số dương').optional(),
  weight: z.coerce.number().positive('Cân nặng phải là số dương').optional(),
  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional(),
  currentIssue: z
    .string()
    .max(1000, 'Vấn đề hiện tại không được vượt quá 1000 ký tự')
    .optional()
})
