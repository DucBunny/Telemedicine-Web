import express from 'express'
import * as patientController from '@/controllers/patient.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import { getPatientByIdParamSchema } from '@/validations/patient.validation'

const router = express.Router()

router.get(
  '/:patientId',
  authorizeRoles(['doctor']),
  validate({ params: getPatientByIdParamSchema }),
  patientController.getPatientDetail,
)

export default router
