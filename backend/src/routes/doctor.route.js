import express from 'express'
import * as doctorController from '@/controllers/doctor.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  getAllDoctorsQuerySchema,
  getDoctorByIdParamSchema,
  getDoctorPatientsQuerySchema,
  createDoctorSchema,
  updateDoctorSchema
} from '@/validations/doctor.validation'

const router = express.Router()

router.get(
  '/',
  authorizeRoles(['patient']),
  validate({ query: getAllDoctorsQuerySchema }),
  doctorController.getAllDoctors
)

router.get(
  '/:doctorId',
  authorizeRoles(['patient']),
  validate({ params: getDoctorByIdParamSchema }),
  doctorController.getDoctorDetail
)
//----------------------------------------

router.get(
  '/me/patients',
  authorizeRoles(['doctor']),
  validate({ query: getDoctorPatientsQuerySchema }),
  doctorController.getMyPatients
)

// Public routes - get all doctors (for patients to browse)

router.get(
  '/:doctorId/patients',
  validate({
    params: getDoctorByIdParamSchema,
    query: getDoctorPatientsQuerySchema
  }),
  doctorController.getDoctorPatients
)

// Admin routes - manage doctors
router.post(
  '/',
  authorizeRoles(['admin']),
  validate({ body: createDoctorSchema }),
  doctorController.createDoctor
)
router.put(
  '/:doctorId',
  authorizeRoles(['admin', 'doctor']),
  validate({ params: getDoctorByIdParamSchema, body: updateDoctorSchema }),
  doctorController.updateDoctor
)
router.delete(
  '/:doctorId',
  authorizeRoles(['admin']),
  validate({ params: getDoctorByIdParamSchema }),
  doctorController.deleteDoctor
)

export default router
