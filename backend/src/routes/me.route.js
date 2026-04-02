import express from 'express'
import * as appointmentController from '@/controllers/appointment.controller'
import * as userController from '@/controllers/user.controller'
import * as medicalRecordController from '@/controllers/medicalRecord.controller'
import * as notificationController from '@/controllers/notification.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import { getAppointmentsQuerySchema } from '@/validations/appointment.validation'
import { getMedicalRecordsQuerySchema } from '@/validations/medicalRecord.validation'
import { getNotificationsQuerySchema } from '../validations/notification.validation'

const router = express.Router()

router.get(
  '/appointments',
  authorizeRoles(['doctor', 'patient']),
  validate({ query: getAppointmentsQuerySchema }),
  appointmentController.getMyAppointments
)

router.get(
  '/profile',
  authorizeRoles(['doctor', 'patient']),
  userController.getMyProfile
)

router.get(
  '/medical-records',
  authorizeRoles(['doctor', 'patient']),
  validate({ query: getMedicalRecordsQuerySchema }),
  medicalRecordController.getMyMedicalRecords
)

router.get(
  '/notifications',
  authorizeRoles(['doctor', 'patient']),
  validate({ query: getNotificationsQuerySchema }),
  notificationController.getNotifications
)

export default router
