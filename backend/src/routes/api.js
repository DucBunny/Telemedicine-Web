import express from 'express'
import { authMiddleware } from '@/middlewares/auth.middleware'
import authRouter from '@/routes/auth.route'
import userRouter from '@/routes/user.route'
import statsRouter from '@/routes/stats.route'
import deviceRouter from '@/routes/device.route'
import doctorRouter from '@/routes/doctor.route'
import patientRouter from '@/routes/patient.route'
import appointmentRouter from '@/routes/appointment.route'
import medicalRecordRouter from '@/routes/medicalRecord.route'
import specialtyRouter from '@/routes/specialty.route'
import uploadRouter from '@/routes/upload.route'
import meRouter from '@/routes/me.route'
import chatRouter from '@/routes/chat.route'
import notificationRouter from '@/routes/notification.route'

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

// Current user
router.use('/me', meRouter)

// Main API routes
router.use('/stats', statsRouter)
router.use('/users', userRouter)
router.use('/devices', deviceRouter)
router.use('/doctors', doctorRouter)
router.use('/patients', patientRouter)
router.use('/appointments', appointmentRouter)
router.use('/medical-records', medicalRecordRouter)
router.use('/specialties', specialtyRouter)
router.use('/uploads', uploadRouter)
router.use('/chat', chatRouter)
router.use('/notifications', notificationRouter)

export default router
