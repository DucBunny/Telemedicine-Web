import express from 'express'
import * as specialtyController from '@/controllers/specialty.controller'

const router = express.Router()

router.get('/', specialtyController.getAllSpecialties)

export default router
