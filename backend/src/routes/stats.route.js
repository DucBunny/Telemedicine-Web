import express from 'express'
import * as statsController from '@/controllers/stats.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get('/admin', authorizeRoles(['admin']), statsController.getSystemStats)
router.get(
  '/doctor',
  authorizeRoles(['doctor']),
  statsController.getDoctorStats
)

export default router
