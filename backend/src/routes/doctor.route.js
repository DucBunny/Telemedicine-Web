import express from 'express'
import * as doctorController from '@/controllers/doctor.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  getAllDoctorsQuerySchema,
  getDoctorByIdParamSchema,
} from '@/validations/doctor.validation'

const router = express.Router()

router.get(
  '/',
  authorizeRoles(['patient']),
  validate({ query: getAllDoctorsQuerySchema }),
  doctorController.getAllDoctors,
)

router.get(
  '/:doctorId',
  authorizeRoles(['patient']),
  validate({ params: getDoctorByIdParamSchema }),
  doctorController.getDoctorDetail,
)

export default router
