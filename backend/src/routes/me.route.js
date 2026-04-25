import express from 'express'
import * as appointmentController from '@/controllers/appointment.controller'
import * as medicalRecordController from '@/controllers/medicalRecord.controller'
import * as notificationController from '@/controllers/notification.controller'
import * as patientController from '@/controllers/patient.controller'
import * as statsController from '@/controllers/stats.controller'
import * as userController from '@/controllers/user.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import { getAppointmentsQuerySchema } from '@/validations/appointment.validation'
import { getMedicalRecordsQuerySchema } from '@/validations/medicalRecord.validation'
import { getNotificationsQuerySchema } from '@/validations/notification.validation'
import { changePasswordSchema } from '@/validations/user.validation'
import { getPatientsQuerySchema } from '../validations/patient.validation'

const router = express.Router()

/**
 * Get statistics for current user
 */
router.get(
  '/stats',
  authorizeRoles(['admin', 'doctor']),
  statsController.getDashboardStats,
)

/**
 * Get appointments for current user
 */
router.get(
  '/appointments',
  authorizeRoles(['doctor', 'patient']),
  validate({ query: getAppointmentsQuerySchema }),
  appointmentController.getMyAppointments,
)

/**
 * Get current user's profile
 */
router.get(
  '/profile',
  authorizeRoles(['doctor', 'patient']),
  userController.getMyProfile,
)

/**
 * Update current user's profile
 */
router.put(
  '/profile',
  authorizeRoles(['doctor', 'patient']),
  userController.updateMyProfile,
)

/**
 * Change current user's password
 */
router.put(
  '/change-password',
  authorizeRoles(['doctor', 'patient']),
  validate({ body: changePasswordSchema }),
  userController.changePassword,
)

/**
 * Get medical records for current user
 */
router.get(
  '/medical-records',
  authorizeRoles(['doctor', 'patient']),
  validate({ query: getMedicalRecordsQuerySchema }),
  medicalRecordController.getMyMedicalRecords,
)

/**
 * Get notifications for current user
 */
router.get(
  '/notifications',
  authorizeRoles(['doctor', 'patient']),
  validate({ query: getNotificationsQuerySchema }),
  notificationController.getNotifications,
)

router.get(
  '/patients',
  authorizeRoles(['doctor']),
  validate({ query: getPatientsQuerySchema }),
  patientController.getMyPatients,
)

export default router
