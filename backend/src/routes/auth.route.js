import express from 'express'
import * as authController from '@/controllers/auth.controller.js'
import { validateBody } from '@/middlewares/validation.middleware.js'
import { registerSchema, loginSchema } from '@/validations/auth.validation.js'

const router = express.Router()

router.post('/register', validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout)

export default router
