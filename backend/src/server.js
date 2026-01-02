import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './routes/api'
import { connectDB } from './config/database'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { errorConverter, errorHandler } from './middlewares/error.middleware'
import { env } from './config/environment'

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

connectDB()

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

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

socketServer.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
