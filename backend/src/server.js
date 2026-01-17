import express from 'express'
import cors from 'cors'
import router from './routes/api'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { errorConverter, errorHandler } from './middlewares/error.middleware'
import { connectMySQL, connectMongoDB, env } from './config'
import { connectMQTT } from './infrastructure/mqtt/mqtt.client'
import { connectRabbitMQ } from './infrastructure/message/rabbitmq.client'
import {
  startHealthConsumer,
  startAlertConsumer
} from './modules/health/health.consumer'
import { initSocket } from './services/socket.service'

const port = env.PORT
const app = express()
app.use(
  cors({
    origin: env.BASE_URL_FRONTEND,
    credentials: true
  })
)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

connectMySQL()
connectMongoDB()

const socketServer = createServer(app)
const io = new Server(socketServer, {
  cors: {
    origin: env.BASE_URL_FRONTEND,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Make io available in routes
app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/api-v1', router)

// Convert error to ApiError, if needed
app.use(errorConverter)

// Handle error
app.use(errorHandler)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Patient join their room để nhận health data realtime
  socket.on('join:patient', (patientId) => {
    socket.join(`patient:${patientId}`)
    console.log(`Patient ${patientId} joined room`)
  })

  // Doctor join monitoring room
  socket.on('join:monitoring', () => {
    socket.join('monitoring')
    socket.join('doctors')
    console.log(`Doctor joined monitoring room`)
  })

  // Leave rooms
  socket.on('leave:patient', (patientId) => {
    socket.leave(`patient:${patientId}`)
    console.log(`Patient ${patientId} left room`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Initialize Socket.IO service
initSocket(io)

socketServer.listen(port, async () => {
  console.log(`Server is running on port http://localhost:${port}`)

  // Khởi động RabbitMQ
  await connectRabbitMQ()

  // Khởi động consumers
  await startHealthConsumer()
  await startAlertConsumer()

  // Khởi động MQTT client
  connectMQTT()

  console.log('All services started successfully')
})
