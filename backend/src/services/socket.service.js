/**
 * Socket.IO service to emit realtime data to frontend
 */

let io

/**
 * Initialize Socket.IO instance
 */
export const initSocket = (socketInstance) => {
  io = socketInstance
  console.log('Socket.IO service initialized')
}

/**
 * Emit health data realtime to frontend
 */
export const emitHealthData = (data) => {
  if (!io) {
    console.warn('Socket.IO not initialized')
    return
  }

  const { deviceId, patientId, bpm, spo2, hrv, status, prediction, timestamp } =
    data

  // Emit to specific patient room
  if (patientId) {
    io.to(`patient:${patientId}`).emit('health:data', {
      deviceId,
      bpm,
      spo2,
      hrv,
      status,
      prediction,
      timestamp: timestamp
    })

    console.log(`Emitted health data to patient:${patientId}`)
  }

  // Emit to all monitoring dashboards
  io.to('monitoring').emit('health:update', {
    deviceId,
    patientId,
    bpm,
    spo2,
    hrv,
    status,
    prediction,
    timestamp: timestamp
  })
}

/**
 * Emit alert đến frontend
 */
export const emitAlert = (alert) => {
  if (!io) {
    console.warn('Socket.IO not initialized')
    return
  }

  const { patientId, deviceId, severity, message, predictionId } = alert

  // Emit to patient
  if (patientId) {
    io.to(`patient:${patientId}`).emit('health:alert', {
      severity,
      message,
      deviceId,
      predictionId,
      timestamp: Date.now()
    })
  }

  // Emit to all doctors/monitoring
  io.to('doctors').emit('health:alert', {
    patientId,
    deviceId,
    severity,
    message,
    predictionId,
    timestamp: Date.now()
  })

  console.log(`Emitted alert to patient:${patientId} and doctors`)
}

/**
 * Emit device status update
 */
export const emitDeviceStatus = (deviceId, status) => {
  if (!io) return

  io.emit('device:status', {
    deviceId,
    status,
    timestamp: Date.now()
  })

  console.log(`Emitted device status: ${deviceId} - ${status}`)
}

/**
 * Get Socket.IO instance
 */
export const getIO = () => io
