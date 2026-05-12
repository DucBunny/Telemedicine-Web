import jwt from 'jsonwebtoken'
import { env } from '@/config'
import * as userRepo from '@/repositories/user.repo'

/**
 * Authenticate socket connection by JWT from handshake auth token.
 */
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake?.auth?.token
    if (!token) {
      return next(new Error('[Socket] Auth error: Missing token'))
    }

    const payload = jwt.verify(token, env.JWT_SECRET)

    const user = await userRepo.findByIdExcludePassword(payload.sub)
    if (!user) return next(new Error('[Socket] Auth error: User not found'))

    socket.user = user

    return next()
  } catch (error) {
    return next(new Error('[Socket] Auth error: Invalid token'))
  }
}
