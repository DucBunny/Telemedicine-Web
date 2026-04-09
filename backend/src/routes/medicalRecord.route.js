import express from 'express'
import * as medicalRecordController from '@/controllers/medicalRecord.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  getMedicalRecordByIdParamSchema,
  createMedicalRecordSchema,
  updateMedicalRecordSchema
} from '@/validations/medicalRecord.validation'

const router = express.Router()

// Get record by ID
router.get(
  '/:recordId',
  authorizeRoles(['doctor', 'patient', 'admin']),
  validate({ params: getMedicalRecordByIdParamSchema }),
  medicalRecordController.getMedicalRecordDetail
)

//----------------------------------------
// Create new record
router.post(
  '/',
  authorizeRoles(['doctor', 'admin']),
  validate({ body: createMedicalRecordSchema }),
  medicalRecordController.createMedicalRecord
)

// Update record
router.put(
  '/:id',
  authorizeRoles(['doctor', 'admin']),
  validate({
    params: getMedicalRecordByIdParamSchema,
    body: updateMedicalRecordSchema
  }),
  medicalRecordController.updateMedicalRecord
)

// Delete record
router.delete(
  '/:id',
  authorizeRoles(['admin']),
  validate({ params: getMedicalRecordByIdParamSchema }),
  medicalRecordController.deleteMedicalRecord
)

export default router
