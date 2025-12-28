import express from 'express'
import { authMiddleware } from '@/middlewares/auth.middleware.js'
import authRouter from './auth.route.js'

const router = express.Router()

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'API is running...'
  })
})

router.use(authMiddleware)
router.use('/auth', authRouter)

export default router
