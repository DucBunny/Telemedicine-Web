import express from 'express'
import * as deviceController from '@/controllers/device.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get('/', authorizeRoles(['admin']), deviceController.getAllDevices)

export default router
