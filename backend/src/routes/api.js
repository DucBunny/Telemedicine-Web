import express from 'express'
import { authMiddleware } from '@/middlewares/auth.middleware'
import appointmentRouter from '@/routes/appointment.route'
import authRouter from '@/routes/auth.route'
import callRouter from '@/routes/call.route'
import chatRouter from '@/routes/chat.route'
import deviceRouter from '@/routes/device.route'
import doctorRouter from '@/routes/doctor.route'
import meRouter from '@/routes/me.route'
import medicalRecordRouter from '@/routes/medicalRecord.route'
import notificationRouter from '@/routes/notification.route'
import patientRouter from '@/routes/patient.route'
import specialtyRouter from '@/routes/specialty.route'
import uploadRouter from '@/routes/upload.route'
import userRouter from '@/routes/user.route'

const router = express.Router()

// Route public
router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'API is running...',
  })
})

router.use('/auth', authRouter)

// Apply authentication middleware for all routes below
router.use(authMiddleware)

// Current user
router.use('/me', meRouter)

// Main API routes
router.use('/appointments', appointmentRouter)
router.use('/calls', callRouter)
router.use('/chat', chatRouter)
router.use('/devices', deviceRouter)
router.use('/doctors', doctorRouter)
router.use('/medical-records', medicalRecordRouter)
router.use('/notifications', notificationRouter)
router.use('/patients', patientRouter)
router.use('/specialties', specialtyRouter)
router.use('/uploads', uploadRouter)
router.use('/users', userRouter)

export default router
