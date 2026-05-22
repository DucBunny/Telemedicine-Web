import { z } from 'zod'
import {
  datetimeStringSchema,
  emptyStringToUndefined,
  intIdSchema,
  paginationWithSearchSchema,
} from '@/validations/common.validation'

const alertStatusEnum = z.enum(
  ['pending', 'handling', 'resolved'],
  'Alert status is invalid',
)

/**
 * Get alerts query schema
 */
export const getAlertsQuerySchema = paginationWithSearchSchema.extend({
  status: emptyStringToUndefined(alertStatusEnum.optional()),
  handledBy: emptyStringToUndefined(
    intIdSchema('Handled by is invalid').optional(),
  ),
  createdFrom: emptyStringToUndefined(datetimeStringSchema.optional()),
  createdTo: emptyStringToUndefined(datetimeStringSchema.optional()),
})

/**
 * Alert ID param schema
 */
export const getAlertByIdParamSchema = z.object({
  alertId: intIdSchema('Alert ID is invalid'),
})

/**
 * Resolve alert body schema
 */
export const resolveAlertBodySchema = z.object({
  symptoms: z
    .string()
    .min(1, 'Symptoms are required')
    .max(2000, 'Symptoms cannot exceed 2000 characters'),
  diagnosis: z
    .string()
    .min(1, 'Diagnosis is required')
    .max(2000, 'Diagnosis cannot exceed 2000 characters'),
  treatmentPlan: z
    .string()
    .max(2000, 'Treatment plan cannot exceed 2000 characters')
    .optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
})
