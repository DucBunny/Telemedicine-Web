import { z } from 'zod'
import {
  intIdSchema,
  paginationWithSearchSchema,
} from '@/validations/common.validation'

/**
 * Get all doctors query schema
 */
export const getAllDoctorsQuerySchema = paginationWithSearchSchema.extend({
  specialtyId: intIdSchema('Specialty ID is invalid').optional(),
})

/**
 * Get doctor by ID param schema
 */
export const getDoctorByIdParamSchema = z.object({
  doctorId: intIdSchema('Doctor ID is invalid'),
})
