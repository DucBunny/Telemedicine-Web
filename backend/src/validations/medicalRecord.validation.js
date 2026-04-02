import { z } from 'zod'
import {
  idParamSchema,
  paginationQuerySchema
} from '@/validations/common.validation'

/**
 * Get medical records query schema
 */
export const getMedicalRecordsQuerySchema = paginationQuerySchema
  .extend({
    search: z.string()
  })
  .partial() // tất cả trường đều optional

/**
 * Get medical record by ID param schema
 */
export const getMedicalRecordByIdParamSchema = idParamSchema

//----------------------------------------
/**
 * Create medical record body schema
 */
export const createMedicalRecordSchema = z.object({
  patientId: z.coerce.number().int().positive('Patient ID không hợp lệ'),
  doctorId: z.coerce.number().int().positive('Doctor ID không hợp lệ'),
  appointmentId: z.string().uuid('Appointment ID không hợp lệ').optional(),
  diagnosis: z
    .string()
    .min(1, 'Chẩn đoán không được để trống')
    .max(2000, 'Chẩn đoán không được vượt quá 2000 ký tự'),
  symptoms: z
    .string()
    .max(2000, 'Triệu chứng không được vượt quá 2000 ký tự')
    .optional(),
  notes: z
    .string()
    .max(2000, 'Ghi chú không được vượt quá 2000 ký tự')
    .optional(),
  prescription: z
    .string()
    .max(2000, 'Đơn thuốc không được vượt quá 2000 ký tự')
    .optional(),
  followUpDate: z.string().datetime('Ngày tái khám không hợp lệ').optional()
})

/**
 * Update medical record body schema
 */
export const updateMedicalRecordSchema = z.object({
  diagnosis: z.string().min(1).max(2000).optional(),
  symptoms: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
  prescription: z.string().max(2000).optional(),
  followUpDate: z.string().datetime().optional()
})
