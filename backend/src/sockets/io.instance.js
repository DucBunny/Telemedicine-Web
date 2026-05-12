/**
 * Socket.IO Instance Singleton
 *
 * Giải quyết vấn đề circular dependency:
 *   sockets/index.js → handlers → ...
 *   services/ → emitters → io.instance (không circular)
 *   sockets/index.js → io.instance.setIo() (một chiều)
 *
 * Sử dụng:
 *   import { getIo } from '@/sockets/io.instance'
 */

/**
 * @type {import('socket.io').Server | null}
 */
let _io = null

/**
 * Lưu io instance — chỉ gọi 1 lần trong sockets/index.js
 * @param {import('socket.io').Server} ioInstance
 */
export const setIo = (ioInstance) => {
  _io = ioInstance
}

/**
 * Lấy io instance đã được khởi tạo
 * @returns {import('socket.io').Server | null}
 */
export const getIo = () => _io
