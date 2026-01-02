import express from 'express'
import { authMiddleware } from '@/middlewares/auth.middleware'
import authRouter from './auth.route'

const router = express.Router()

// Route public
router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'API is running...'
  })
})

router.use('/auth', authRouter)

// Apply authentication middleware for all routes below
router.use(authMiddleware)

export default router
