import express from 'express'
import * as medicalRecordController from '@/controllers/medicalRecord.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  createMedicalRecordSchema,
  getMedicalRecordByIdParamSchema,
  updateMedicalRecordSchema,
} from '@/validations/medicalRecord.validation'

const router = express.Router()

// Get record by ID
router.get(
  '/:recordId',
  authorizeRoles(['doctor', 'patient', 'admin']),
  validate({ params: getMedicalRecordByIdParamSchema }),
  medicalRecordController.getMedicalRecordDetail,
)

export default router
