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

/**
 * Create medical record body schema
 */
export const createMedicalRecordSchema = z.object({
  patientId: intIdSchema('Patient ID is invalid'),
  appointmentId: intIdSchema('Appointment ID is invalid'),
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
  prescription: z
    .array(
      z.string().max(2000, 'Prescription item cannot exceed 2000 characters'),
    )
    .optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
})

/**
 * Update medical record body schema
 */
export const updateMedicalRecordSchema = z.object({
  symptoms: z.string().max(2000).optional(),
  diagnosis: z.string().min(1).max(2000).optional(),
  treatmentPlan: z.string().max(2000).optional(),
  prescription: z
    .array(
      z.string().max(2000, 'Prescription item cannot exceed 2000 characters'),
    )
    .optional(),
  notes: z.string().max(2000).optional(),
})
