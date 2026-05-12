import { createServer } from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import express from 'express'
import { Server } from 'socket.io'
import { env, redis } from '@/config'
import {
  registerCallHandler,
  registerChatHandler,
  registerMonitorHandler,
  registerSystemHandler,
} from '@/sockets/handlers'
import { setIo } from '@/sockets/io.instance'
import { socketAuthMiddleware } from '@/sockets/socket.auth'

const app = express()

const socketServer = createServer(app)

const io = new Server(socketServer, {
  cors: {
    origin: env.BASE_URL_FRONTEND,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000, // 60s timeout for client inactivity (to allow for mobile networks)
  pingInterval: 25000, // 25s interval for sending pings (must be less than pingTimeout)
})

const pubClient = redis
const subClient = redis.duplicate()
io.adapter(createAdapter(pubClient, subClient))

// Đăng ký io vào singleton — services/emitters dùng getIo() để lấy, tránh circular import
setIo(io)

io.of('/system').use(socketAuthMiddleware)
io.of('/monitor').use(socketAuthMiddleware)
io.of('/chat').use(socketAuthMiddleware)
io.of('/call').use(socketAuthMiddleware)

// Khởi chạy Handlers
registerSystemHandler(io)
registerChatHandler(io)
registerMonitorHandler(io)
registerCallHandler(io)

// io.on('connection', (socket) => {
//   console.log(`[Socket] Client connected: ${socket.id}, user:${socket.user.id}`)

//   socket.on('disconnect', () => {
//     console.log(
//       `[Socket] Client disconnected: ${socket.id}, user:${socket.user.id}`,
//     )
//   })
// })

export { io, app, socketServer }
