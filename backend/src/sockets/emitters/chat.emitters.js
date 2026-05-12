/**
 * Chat Namespace Emitters
 *
 * Cac ham emit su kien tren namespace /chat
 */

import { getIo } from '@/sockets/io.instance'
import { CHAT_EVENTS, SOCKET_ROOMS } from '@/sockets/socket.constants'

/**
 * Emit message:new den phong conversation
 *
 * @param {string} conversationId - ID cua conversation
 * @param {object} payload - Du lieu message
 */
export const emitChatMessageNew = (conversationId, payload) => {
  const io = getIo()

  if (!io) {
    console.warn('[Chat Emitter] io not initialized — cannot emit message')
    return
  }

  const room = SOCKET_ROOMS.CHAT.CONVERSATION(conversationId)
  io.of('/chat').to(room).emit(CHAT_EVENTS.MESSAGE_NEW, payload)
}

/**
 * Emit message:read den phong conversation
 *
 * @param {string} conversationId - ID cua conversation
 * @param {object} payload - Du lieu read event
 */
export const emitChatMessageRead = (conversationId, payload) => {
  const io = getIo()

  if (!io) {
    console.warn('[Chat Emitter] io not initialized — cannot emit read')
    return
  }

  const room = SOCKET_ROOMS.CHAT.CONVERSATION(conversationId)
  io.of('/chat').to(room).emit(CHAT_EVENTS.MESSAGE_READ, payload)
}
