import express from 'express'
import { authMiddleware } from '@/middlewares/auth.middleware'
import authRouter from './auth.route'
import userRouter from './user.route'
import statsRouter from './stats.route'
import deviceRouter from './device.route'
import patientRouter from './patient.route'
import appointmentRouter from './appointment.route'
import medicalRecordRouter from './medicalRecord.route'

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
router.use('/stats', statsRouter)
router.use('/users', userRouter)
router.use('/devices', deviceRouter)
router.use('/patients', patientRouter)
router.use('/appointments', appointmentRouter)
router.use('/records', medicalRecordRouter)

export default router
