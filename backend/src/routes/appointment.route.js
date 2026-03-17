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

// GET /appointments/available-slots?doctor_id=&date=YYYY-MM-DD  (bệnh nhân xem slot trống)
router.get(
  '/available-slots',
  authorizeRoles(['patient']),
  appointmentController.getAvailableSlots
)

// POST /appointments/book  (bệnh nhân đặt lịch)
router.post(
  '/book',
  authorizeRoles(['patient']),
  appointmentController.bookAppointment
)

// POST /appointments/:id/confirm  (bác sĩ/admin duyệt lịch)
router.post(
  '/:id/confirm',
  authorizeRoles(['doctor', 'admin']),
  appointmentController.confirmAppointment
)

export default router
