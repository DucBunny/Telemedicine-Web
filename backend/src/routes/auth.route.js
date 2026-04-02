import express from 'express'
import * as authController from '@/controllers/auth.controller'
import { validate } from '@/middlewares/validation.middleware'
import { registerSchema, loginSchema } from '@/validations/auth.validation'

const router = express.Router()

router.post(
  '/register',
  validate({ body: registerSchema }),
  authController.register
)
router.post('/login', validate({ body: loginSchema }), authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout)

export default router
