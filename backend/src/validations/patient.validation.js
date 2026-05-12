import { z } from 'zod'
import {
  emptyStringToUndefined,
  intIdSchema,
  paginationWithSearchSchema,
} from '@/validations/common.validation'

/**
 * Gender enum
 */
const genderEnum = z.enum(['male', 'female', 'other'], 'Gender is invalid')

/**
 * Blood type enum
 */
const bloodTypeEnum = z.enum(
  ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', 'unknown'],
  'Blood type is invalid',
)

/**
 * Get patients query schema
 */
export const getPatientsQuerySchema = paginationWithSearchSchema.extend({
  bloodType: emptyStringToUndefined(bloodTypeEnum.optional()),
  gender: emptyStringToUndefined(genderEnum.optional()),
  dobFrom: emptyStringToUndefined(z.iso.date().optional()),
  dobTo: emptyStringToUndefined(z.iso.date().optional()),
})

/**
 * Get patient by ID param schema
 */
export const getPatientByIdParamSchema = z.object({
  patientId: intIdSchema('Patient ID is invalid'),
})
