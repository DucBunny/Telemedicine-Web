import express from 'express'
import * as appointmentController from '@/controllers/appointment.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  getAppointmentByIdParamSchema,
  createAppointmentSchema,
  confirmAppointmentSchema,
  cancelAppointmentSchema,
  getAvailableSlotsQuerySchema
} from '@/validations/appointment.validation'

const router = express.Router()

/**
 * @route POST /appointments
 * @description Create a new appointment
 */
router.post(
  '/',
  authorizeRoles(['patient']),
  validate({ body: createAppointmentSchema }),
  appointmentController.createAppointment
)

/**
 * @route GET /appointments/available-slots?doctorId=&date=YYYY-MM-DD
 * @description Get available appointment slots
 */
router.get(
  '/available-slots',
  authorizeRoles(['patient']),
  validate({ query: getAvailableSlotsQuerySchema }),
  appointmentController.getAvailableSlots
)

/**
 * @route PUT /appointments/:id/cancel
 * @description Doctor or patient cancels an appointment
 */
router.put(
  '/:id/cancel',
  authorizeRoles(['doctor', 'patient']),
  validate({
    params: getAppointmentByIdParamSchema,
    body: cancelAppointmentSchema
  }),
  appointmentController.cancelAppointment
)

//-------------------------------------------------------
/**
 * @route POST /appointments/:id/confirm
 * @description Doctor confirms an appointment
 */
router.post(
  '/:id/confirm',
  authorizeRoles(['doctor', 'admin']),
  validate({
    params: getAppointmentByIdParamSchema,
    body: confirmAppointmentSchema
  }),
  appointmentController.confirmAppointment
)

export default router
