import express from 'express'
import * as doctorController from '@/controllers/doctor.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get('/profile', authorizeRoles(['doctor']), doctorController.getProfile)

export default router
