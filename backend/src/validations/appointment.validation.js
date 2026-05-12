import { z } from 'zod'
import {
  datetimeStringSchema,
  emptyStringOrArrayToUndefined,
  emptyStringToUndefined,
  intIdSchema,
  paginationWithSearchSchema,
} from '@/validations/common.validation'

const appointmentStatusEnum = z.enum(
  ['pending', 'confirmed', 'completed', 'cancelled'],
  'Appointment status is invalid',
)

const appointmentTypeEnum = z.enum(
  ['online', 'offline'],
  'Appointment type is invalid',
)

/**
 * Get appointment by ID param schema
 */
export const getAppointmentByIdParamSchema = z.object({
  appointmentId: intIdSchema('Appointment ID is invalid'),
})

/**
 * Get appointments query schema
 */
export const getAppointmentsQuerySchema = paginationWithSearchSchema.extend({
  status: emptyStringOrArrayToUndefined(
    z.union([appointmentStatusEnum, z.array(appointmentStatusEnum)]).optional(),
  ), // hỗ trợ filter theo 1 hoặc nhiều status; status rỗng sẽ bỏ filter
  type: emptyStringToUndefined(appointmentTypeEnum.optional()),
  scheduledFrom: emptyStringToUndefined(datetimeStringSchema.optional()),
  scheduledTo: emptyStringToUndefined(datetimeStringSchema.optional()),
})

/**
 * Cancel appointment body schema
 */
export const cancelAppointmentSchema = z.object({
  cancelReason: z
    .string()
    .min(1, 'Cancel reason is required')
    .max(500, 'Cancel reason cannot exceed 500 characters'),
})

/**
 * Get available slots query schema
 */
export const getAvailableSlotsQuerySchema = z.object({
  doctorId: intIdSchema('Doctor ID is invalid'),
  date: z.iso.date('Date is invalid'),
})

/**
 * Create appointment body schema
 */
export const createAppointmentSchema = z.object({
  doctorId: intIdSchema('Doctor ID is invalid').optional(),
  patientId: intIdSchema('Patient ID is invalid').optional(),
  scheduledAt: datetimeStringSchema.refine(
    (val) => new Date(val).getTime() > Date.now(),
    {
      message: 'Appointment must be scheduled in the future',
    },
  ),
  durationMinutes: z.coerce
    .number()
    .int()
    .refine((v) => [30, 60].includes(v), {
      message: 'Duration must be 30 or 60 minutes',
    })
    .default(30),
  type: appointmentTypeEnum,
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(500, 'Reason cannot exceed 500 characters'),
})

/**
 * Patch doctor appointment status body schema
 */
export const patchDoctorAppointmentStatusSchema = z
  .object({
    status: z.enum(['completed', 'cancelled']),
    cancelReason: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'cancelled' && !data.cancelReason?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cancel reason is required when cancelling',
        path: ['cancelReason'],
      })
    }
  })
