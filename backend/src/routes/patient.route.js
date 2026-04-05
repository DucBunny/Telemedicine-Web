import express from 'express'
import * as patientController from '@/controllers/patient.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  getAllPatientsQuerySchema,
  getPatientByIdParamSchema,
  createPatientSchema,
  updatePatientSchema,
  updatePatientProfileSchema
} from '@/validations/patient.validation'

const router = express.Router()

router.get(
  '/doctor',
  authorizeRoles(['doctor']),
  patientController.getPatientsByDoctorId
)
// router.get(
//   '/me/devices',
//   authorizeRoles(['patient']),
//   patientController.getMyDevices
// )

// router.get(
//   '/',
//   authorizeRoles(['doctor', 'admin']),
//   patientController.getAllPatients
// )
// router.get('/:id', patientController.getPatientById)
// router.get('/:id/devices', patientController.getPatientDevices)

// // Admin routes - manage patients
// router.post('/', authorizeRoles(['admin']), patientController.createPatient)
// router.put(
//   '/:id',
//   authorizeRoles(['admin', 'patient']),
//   patientController.updatePatient
// )
// router.delete(
//   '/:id',
//   authorizeRoles(['admin']),
//   patientController.deletePatient
// )

// ---------------------------------------

// router.patch(
//   '/profile',
//   authorizeRoles(['patient']),
//   validate({ body: updatePatientProfileSchema }),
//   patientController.updateMyProfile
// )
// router.get(
//   '/me/devices',
//   authorizeRoles(['patient']),
//   patientController.getMyDevices
// )

// // Public routes (for doctors to view patients)
// router.get(
//   '/',
//   authorizeRoles(['doctor', 'admin']),
//   validate({ query: getAllPatientsQuerySchema }),
//   patientController.getAllPatients
// )
// router.get(
//   '/:id/devices',
//   validate({ params: getPatientByIdParamSchema }),
//   patientController.getPatientDevices
// )

// // Admin routes - manage patients
// router.post(
//   '/',
//   authorizeRoles(['admin']),
//   validate({ body: createPatientSchema }),
//   patientController.createPatient
// )
// router.put(
//   '/:id',
//   authorizeRoles(['admin', 'patient']),
//   validate({ params: getPatientByIdParamSchema, body: updatePatientSchema }),
//   patientController.updatePatient
// )
// router.delete(
//   '/:id',
//   authorizeRoles(['admin']),
//   validate({ params: getPatientByIdParamSchema }),
//   patientController.deletePatient
// )

export default router
