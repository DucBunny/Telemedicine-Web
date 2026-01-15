import express from 'express'
import * as patientController from '@/controllers/patient2.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

// Protected routes - for patients (must come before /:id routes)
router.get(
  '/me/profile',
  authorizeRoles(['patient']),
  patientController.getMyProfile
)
router.get(
  '/me/devices',
  authorizeRoles(['patient']),
  patientController.getMyDevices
)

// Public routes (for doctors to view patients)
router.get(
  '/',
  authorizeRoles(['doctor', 'admin']),
  patientController.getAllPatients
)
router.get('/:id', patientController.getPatientById)
router.get('/:id/devices', patientController.getPatientDevices)

// Admin routes - manage patients
router.post('/', authorizeRoles(['admin']), patientController.createPatient)
router.put(
  '/:id',
  authorizeRoles(['admin', 'patient']),
  patientController.updatePatient
)
router.delete(
  '/:id',
  authorizeRoles(['admin']),
  patientController.deletePatient
)

export default router
