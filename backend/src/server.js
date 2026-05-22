import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { connectMailer, connectMongoDB, connectMySQL, env } from '@/config'
import { connectRabbitMQ } from '@/config/rabbitmq.config'
import { schedulePendingAppointmentExpiryJob } from '@/jobs/pendingAppointments.job'
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

  // Khởi động RabbitMQ
  await connectRabbitMQ()

  // Khởi động Mailer
  connectMailer()

  // Khởi động MQTT client
  connectMQTT()

  // Khởi động cron job
  schedulePendingAppointmentExpiryJob()

  console.log('All services started successfully')
})
