import express from 'express'
import * as appointmentController from '@/controllers/appointment.controller'
import * as medicalRecordController from '@/controllers/medicalRecord.controller'
import * as notificationController from '@/controllers/notification.controller'
import * as patientController from '@/controllers/patient.controller'
import * as statsController from '@/controllers/stats.controller'
import * as userController from '@/controllers/user.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  getAppointmentByIdParamSchema,
  getAppointmentsQuerySchema,
} from '@/validations/appointment.validation'
import { getMedicalRecordsQuerySchema } from '@/validations/medicalRecord.validation'
import { getNotificationsQuerySchema } from '@/validations/notification.validation'
import {
  getPatientByIdParamSchema,
  getPatientsQuerySchema,
} from '@/validations/patient.validation'
import { changePasswordSchema } from '@/validations/user.validation'

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
 * GET appointment detail for current user
 */
router.get(
  '/appointments/:appointmentId',
  authorizeRoles(['doctor', 'patient']),
  validate({ params: getAppointmentByIdParamSchema }),
  appointmentController.getMyAppointmentById,
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

/**
 * Get current doctor's patients
 */
router.get(
  '/patients',
  authorizeRoles(['doctor']),
  validate({ query: getPatientsQuerySchema }),
  patientController.getMyPatients,
)

/**
 * Get patient's appointments for current doctor
 */
router.get(
  '/patients/:patientId/appointments',
  authorizeRoles(['doctor']),
  validate({
    query: getAppointmentsQuerySchema,
    params: getPatientByIdParamSchema,
  }),
  appointmentController.getAppointmentByPatientIdAndCurrentDoctor,
)

/**
 * Get patient's medical records for current doctor
 */
router.get(
  '/patients/:patientId/medical-records',
  authorizeRoles(['doctor']),
  validate({
    query: getMedicalRecordsQuerySchema,
    params: getPatientByIdParamSchema,
  }),
  medicalRecordController.getMedicalRecordsByPatientIdAndCurrentDoctor,
)

/**
 * Get related users' presence status for current user
 */
router.get(
  '/presence',
  authorizeRoles(['doctor', 'patient']),
  userController.getMyRelatedUsersPresence,
)

export default router
