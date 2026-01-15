import express from 'express'
import * as medicalRecordController from '@/controllers/medicalRecord.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get(
  '/doctor',
  authorizeRoles(['doctor']),
  medicalRecordController.getMedicalRecordsByDoctorId
)
router.get(
  '/patient',
  authorizeRoles(['patient']),
  medicalRecordController.getMedicalRecordsByPatientId
)

export default router
