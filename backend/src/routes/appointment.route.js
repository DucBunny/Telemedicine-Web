import express from 'express'
import * as appointmentController from '@/controllers/appointment.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get(
  '/doctor',
  authorizeRoles(['doctor']),
  appointmentController.getAppointmentsByDoctorId
)
router.get(
  '/patient',
  authorizeRoles(['patient']),
  appointmentController.getAppointmentsByPatientId
)

export default router
