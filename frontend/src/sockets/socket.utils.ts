import type { Socket } from 'socket.io-client'

/**
 * Closes a Socket.IO client without aborting a WebSocket mid-handshake.
 * Calling `socket.disconnect()` while still connecting triggers:
 * "WebSocket is closed before the connection is established".
 */
export function destroySocket(socket: Socket): void {
  socket.removeAllListeners()
  socket.io.opts.reconnection = false

  if (socket.connected) {
    socket.disconnect()
    return
  }

  socket.io._close()
}
