import express from 'express'
import * as specialtyController from '@/controllers/specialty.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import { intIdSchema } from '@/validations/common.validation'
import z from 'zod'

const router = express.Router()

router.get(
  '/',
  authorizeRoles(['patient']),
  specialtyController.getAllSpecialties
)
router.get(
  '/:specialtyId',
  authorizeRoles(['patient']),
  validate({
    params: z.object({ specialtyId: intIdSchema('Specialty ID is invalid') })
  }),
  specialtyController.getSpecialtyDetail
)

export default router
