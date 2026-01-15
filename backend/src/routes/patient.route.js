import express from 'express'
import * as patientController from '@/controllers/patient.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get(
  '/profile',
  authorizeRoles(['patient']),
  patientController.getProfile
)

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

export default router
