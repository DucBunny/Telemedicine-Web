import { z } from 'zod'
import {
  paginationQuerySchema,
  datetimeStringSchema,
  intIdSchema
} from '@/validations/common.validation'

const appointmentStatusEnum = z.enum(
  ['pending', 'confirmed', 'completed', 'cancelled'],
  'Appointment status is invalid'
)

const appointmentTypeEnum = z.enum(
  ['online', 'offline'],
  'Appointment type is invalid'
)

/**
 * Get appointment by ID param schema
 */
export const getAppointmentByIdParamSchema = z.object({
  appointmentId: intIdSchema('Appointment ID is invalid')
})

/**
 * Get appointments query schema
 */
export const getAppointmentsQuerySchema = paginationQuerySchema
  .extend({
    status: z.union([appointmentStatusEnum, z.array(appointmentStatusEnum)]), // hỗ trợ filter theo 1 hoặc nhiều status (string or array)
    type: appointmentTypeEnum
  })
  .partial() // tất cả trường đều optional

/**
 * Cancel appointment body schema
 */
export const cancelAppointmentSchema = z.object({
  cancelReason: z
    .string()
    .min(1, 'Cancel reason is required')
    .max(500, 'Cancel reason cannot exceed 500 characters')
})

/**
 * Get available slots query schema
 */
export const getAvailableSlotsQuerySchema = z.object({
  doctorId: intIdSchema('Doctor ID is invalid'),
  date: z.iso.date('Date is invalid')
})

/**
 * Create appointment body schema
 */
export const createAppointmentSchema = z.object({
  doctorId: intIdSchema('Doctor ID is invalid'),
  scheduledAt: datetimeStringSchema,
  durationMinutes: z.coerce
    .number()
    .int()
    .refine((v) => [30, 60].includes(v), {
      message: 'Duration must be 30 or 60 minutes'
    })
    .default(30),
  type: appointmentTypeEnum,
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(500, 'Reason cannot exceed 500 characters')
})

//-------------------------------------------------------
/**
 * Update appointment body schema
 */
export const updateAppointmentSchema = z.object({
  scheduledAt: datetimeStringSchema.optional(),
  actualEndedAt: datetimeStringSchema.optional(),
  durationMinutes: z.coerce
    .number()
    .int()
    .refine((v) => [30, 60].includes(v), {
      message: 'Duration must be 30 or 60 minutes'
    })
    .optional(),
  status: appointmentStatusEnum.optional(),
  type: appointmentTypeEnum.optional(),
  meetingLink: z.string().url('Link meeting không hợp lệ').optional(),
  reason: z.string().max(500).optional(),
  cancelReason: z
    .string()
    .max(500, 'Cancel reason cannot exceed 500 characters')
    .optional()
})

/**
 * Confirm appointment body schema
 */
export const confirmAppointmentSchema = z.object({
  meetingLink: z.string().url('Link meeting không hợp lệ').optional()
})
