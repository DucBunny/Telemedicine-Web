import { z } from 'zod'
import {
  datetimeStringSchema,
  emptyStringToUndefined,
  intIdSchema,
  paginationWithSearchSchema,
} from '@/validations/common.validation'

/**
 * Get medical records query schema
 */
export const getMedicalRecordsQuerySchema = paginationWithSearchSchema.extend({
  createdFrom: emptyStringToUndefined(datetimeStringSchema.optional()),
  createdTo: emptyStringToUndefined(datetimeStringSchema.optional()),
})

/**
 * Get medical record by ID param schema
 */
export const getMedicalRecordByIdParamSchema = z.object({
  recordId: intIdSchema('Medical record ID is invalid'),
})
