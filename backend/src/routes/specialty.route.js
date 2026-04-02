import express from 'express'
import * as specialtyController from '@/controllers/specialty.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get(
  '/',
  authorizeRoles(['patient']),
  specialtyController.getAllSpecialties
)
router.get(
  '/:id',
  authorizeRoles(['patient']),
  specialtyController.getSpecialtyDetail
)

export default router
