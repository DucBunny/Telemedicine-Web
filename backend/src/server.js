import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { connectMailer, connectMongoDB, connectMySQL, env } from '@/config'
import { startEcgAbnormalStripWorker } from '@/jobs/ecgAbnormalStrip.queue'
import { startEcgInferenceWorker } from '@/jobs/ecgInference.queue'
import { scheduleEcgRawFlushJob } from '@/jobs/ecgRawFlush.job'
import { startMedicalReportWorker } from '@/jobs/medicalReport.queue'
import { schedulePendingAppointmentExpiryJob } from '@/jobs/pendingAppointments.job'
import { scheduleStaleAlertAutoResolveJob } from '@/jobs/staleAlerts.job'
import { errorConverter, errorHandler } from '@/middlewares/error.middleware'
import { connectMQTT } from '@/mqtt/mqtt.client'
import router from '@/routes/api'
import { app, socketServer } from '@/sockets'

const port = env.PORT
app.use(
  cors({
    origin: env.BASE_URL_FRONTEND,
    credentials: true,
  }),
)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

connectMySQL()
connectMongoDB()

app.use('/api-v1', router)

// Convert error to ApiError, if needed
app.use(errorConverter)

// Handle error
app.use(errorHandler)

socketServer.listen(port, async () => {
  console.log(`Server is running on port http://localhost:${port}`)

  // Khởi động Mailer
  await connectMailer()

  // Khởi động background worker / cron jobs
  await startEcgAbnormalStripWorker()
  await startEcgInferenceWorker()
  await startMedicalReportWorker()
  scheduleEcgRawFlushJob()
  schedulePendingAppointmentExpiryJob()
  scheduleStaleAlertAutoResolveJob()

  // Khởi động MQTT client
  connectMQTT()

  console.log('All services started successfully')
})
