import express from 'express'
import * as doctorController from '@/controllers/doctor2.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

// Protected routes - for doctors (must come before /:id routes)
router.get(
  '/me/profile',
  authorizeRoles(['doctor']),
  doctorController.getMyProfile
)
router.get(
  '/me/patients',
  authorizeRoles(['doctor']),
  doctorController.getMyPatients
)

// Public routes - get all doctors (for patients to browse)
router.get('/', doctorController.getAllDoctors)
router.get('/:id', doctorController.getDoctorById)
router.get('/:id/patients', doctorController.getDoctorPatients)

// Admin routes - manage doctors
router.post('/', authorizeRoles(['admin']), doctorController.createDoctor)
router.put(
  '/:id',
  authorizeRoles(['admin', 'doctor']),
  doctorController.updateDoctor
)
router.delete('/:id', authorizeRoles(['admin']), doctorController.deleteDoctor)

export default router
