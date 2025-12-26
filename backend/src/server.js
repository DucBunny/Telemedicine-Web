import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './routes/api.js'
import { connectDB } from './config/database.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { createServer } from 'http'

const port = process.env.PORT || 8080
const app = express()
app.use(
  cors({
    origin: process.env.BASE_URL_FRONTEND || 'http://localhost:3000',
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
    origin: process.env.BASE_URL_FRONTEND || 'http://localhost:3000',
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

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

socketServer.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
