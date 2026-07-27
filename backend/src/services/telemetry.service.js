import {
  clearThrottledAlertId,
  getThrottledAlertId,
  refreshThrottleTTL,
  setThrottledAlertId,
} from '@/cache/alertThrottle.cache'
import { env } from '@/config'
import { schedulePersistAbnormalStripJob } from '@/jobs/ecgAbnormalStrip.queue'
import { enqueueEcgInferenceJob } from '@/jobs/ecgInference.queue'
import * as alertRepo from '@/repositories/alert.repo'
import * as deviceRepo from '@/repositories/device.repo'
import * as doctorRepo from '@/repositories/doctor.repo'
import { notifyAlertCreated } from '@/services/alert.service'
import { sendAlertEmailToDoctors } from '@/services/mail.service'
import * as patientDoctorService from '@/services/patientDoctor.service'
import { emitEcgPacketToPatientMonitor } from '@/sockets/emitters/monitor.emitters'
import {
  emitAlertCalmToDoctors,
  emitAlertFlashToDoctors,
} from '@/sockets/emitters/system.emitters'

const ECG_CLASS_MESSAGES = {
  S: 'Phát hiện ngoại tâm thu trên thất (S)',
  V: 'Phát hiện ngoại tâm thu thất (V)',
  F: 'Phát hiện nhịp hợp nhất (F)',
  Q: 'Phát hiện nhịp không xác định (Q)',
}

const alertTypeFromClass = (classInference) =>
  `ecg_${String(classInference).toUpperCase()}`

const buildAlertMessage = (classInference) =>
  ECG_CLASS_MESSAGES[classInference] ||
  `Phát hiện bất thường ECG (class: ${classInference})`

// Lên lịch job lưu ECG abnormal strip vào MongoDB
const scheduleAbnormalStripPersistence = async (alert) => {
  try {
    await schedulePersistAbnormalStripJob(alert)
  } catch (error) {
    console.error('[Telemetry] Failed to schedule abnormal strip job:', error)
  }
}

/**
 * Resolve device + patient từ gói telemetry
 * @param {object} data - Gói telemetry
 * @returns {object} { deviceId, patientId }
 * @example
 * const deviceContext = await resolveDeviceContext(data) => { deviceId: 1, patientId: 1 }
 */
const resolveDeviceContext = async (data) => {
  const deviceId = Number.parseInt(data?.id, 10)
  if (!deviceId) return null

  const device = await deviceRepo.findById(deviceId)
  if (!device?.assignedTo) return null

  return {
    deviceId: device.id,
    patientId: device.assignedTo,
  }
}

/**
 * Gửi gói ECG đến monitor của bệnh nhân.
 */
const emitMonitorPacket = (ctx, payload) => {
  emitEcgPacketToPatientMonitor(ctx.patientId, {
    deviceId: ctx.deviceId,
    ...payload,
  })
}

/**
 * Gói warmup: chỉ stream waveform, không phát hiện bất thường.
 */
export const handleWarmupPacket = async (
  ctx,
  { packetEcg, timestamp, beatCount, inferenceError },
) => {
  emitMonitorPacket(ctx, {
    packetEcg,
    classInference: null,
    timeInference: null,
    inferenceReady: false,
    inferenceConfidence: null,
    beatCount,
    timestamp,
  })

  if (inferenceError)
    console.warn(
      `[Telemetry] Inference unavailable for device ${ctx.deviceId} (beat ${beatCount}): ${inferenceError}`,
    )
}

/**
 * Normal inference: monitor + calm pending alerts.
 */
export const handleNormalInference = async (ctx, socketPayload) => {
  emitMonitorPacket(ctx, socketPayload)

  const pendingAlerts = await alertRepo.findPendingByPatientId(ctx.patientId)
  if (!pendingAlerts.length) return

  const doctorIds = await patientDoctorService.getRelatedUserIds(
    ctx.patientId,
    'patient',
  )
  if (!doctorIds.length) return

  for (const alert of pendingAlerts) {
    emitAlertCalmToDoctors(doctorIds, {
      alertId: alert.id,
      patientId: ctx.patientId,
      type: alert.type,
    })
  }
}

/**
 * Abnormal inference: monitor + alert throttle + socket/email.
 */
export const handleAbnormalInference = async (
  ctx,
  socketPayload,
  classInference,
) => {
  emitMonitorPacket(ctx, socketPayload)

  const alertType = alertTypeFromClass(classInference)
  const now = socketPayload.timestamp
    ? new Date(socketPayload.timestamp)
    : new Date()
  const doctorIds = await patientDoctorService.getRelatedUserIds(
    ctx.patientId,
    'patient',
  )

  if (doctorIds.length === 0) {
    console.warn(
      '[Telemetry] No doctors linked to patient %s — skip alert',
      ctx.patientId,
    )
    return
  }

  // Kiểm tra throttle alert đang mở (nếu còn trong cửa sổ TTL)
  let alertId = await getThrottledAlertId(ctx.patientId, alertType)

  // Đề phòng redis cache bị lỗi restart
  if (!alertId) {
    // Kiểm tra alert đang mở
    const openAlert = await alertRepo.findOpenByPatientAndType(
      ctx.patientId,
      alertType,
    )

    if (openAlert) {
      // Kiểm tra thời gian từ lastDetectedAt
      const lastDetectedAt = new Date(openAlert.lastDetectedAt)
      const elapsedMinutes = (now.getTime() - lastDetectedAt.getTime()) / 60000

      // Nếu đã quá 30 phút → Coi như đợt bất thường mới, không dùng alert cũ
      if (elapsedMinutes >= 30) {
        alertId = null
      } else {
        // Vẫn trong cửa sổ 30 phút → Gộp vào alert cũ
        alertId = openAlert.id
        await setThrottledAlertId(
          ctx.patientId,
          alertType,
          alertId,
          env.ALERT_THROTTLE_TTL_SEC,
        )
      }
    }
  }

  // Kiểm tra alert đã xử lý
  if (alertId) {
    const existing = await alertRepo.findById(alertId)
    if (!existing || existing.status === 'resolved') {
      await clearThrottledAlertId(ctx.patientId, alertType)
      alertId = null
    }
  }

  if (alertId) {
    // Cập nhật biến anomalyCount và lastDetectedAt
    const updated = await alertRepo.recordAnomalyDetection(alertId, now)

    // Nếu không cập nhật được → xóa throttle và return
    if (!updated) {
      await clearThrottledAlertId(ctx.patientId, alertType)
      return
    }

    // Reset Redis TTL để đảm bảo tạo alert mới sau 30 phút từ lastDetectedAt
    await refreshThrottleTTL(ctx.patientId, alertType)
    await scheduleAbnormalStripPersistence(updated)

    // Chỉ nháy khi pending (đang xử lý / đã resolve → không nháy)
    if (updated.status === 'pending') {
      emitAlertFlashToDoctors(doctorIds, {
        alertId: updated.id,
        patientId: ctx.patientId,
        type: alertType,
        anomalyCount: updated.anomalyCount,
        lastDetectedAt: updated.lastDetectedAt,
      })
    }
    return
  }

  // Nếu không có alertId → tạo alert mới
  const alert = await alertRepo.create({
    patientId: ctx.patientId,
    deviceId: ctx.deviceId,
    type: alertType,
    value: null, // ECG value is not used for alert
    message: buildAlertMessage(classInference),
    triggerTimestamp: now,
    lastDetectedAt: now,
    anomalyCount: 1,
    status: 'pending',
  })

  await alertRepo.createRecipients(alert.id, doctorIds)
  await setThrottledAlertId(
    ctx.patientId,
    alertType,
    alert.id,
    env.ALERT_THROTTLE_TTL_SEC,
  )
  await scheduleAbnormalStripPersistence(alert)

  const fullAlert = await alertRepo.findById(alert.id)
  await notifyAlertCreated(fullAlert)

  emitAlertFlashToDoctors(doctorIds, {
    alertId: fullAlert.id,
    patientId: ctx.patientId,
    type: alertType,
    anomalyCount: fullAlert.anomalyCount,
    lastDetectedAt: fullAlert.lastDetectedAt,
  })

  const doctors = await doctorRepo.findDoctorEmailsByUserIds(doctorIds)
  const patient = fullAlert?.patient?.user

  try {
    await sendAlertEmailToDoctors({
      doctors,
      alert: fullAlert,
      patientName: patient?.fullName,
    })
  } catch (err) {
    console.error('[Telemetry] Failed to send alert emails:', err)
  }
}

/**
 * MQTT telemetry: validate packet_ecg and enqueue BullMQ inference job.
 */
export const processTelemetryMessage = async (payload) => {
  const data = payload?.data
  if (!data) return

  const packetEcg = data.packet_ecg
  if (
    !Array.isArray(packetEcg) ||
    packetEcg.length !== Number.parseInt(env.ECG_PACKET_SIZE, 10)
  )
    return

  const ctx = await resolveDeviceContext(data)
  if (!ctx) {
    console.warn('[Telemetry] Device not found or unassigned:', data.id)
    return
  }

  // Parse timestamp: use epoch if synced, otherwise use server time
  let timestampMs = Number(payload?.time)
  // Check if it's epoch (> year 2020: 1577836800000) or millis() from ESP32 boot
  const isEpochTime = timestampMs > 1577836800000 // 2020-01-01 00:00:00 UTC
  if (!isEpochTime || !timestampMs) {
    timestampMs = Date.now() // Fallback to server time
    console.warn(
      `[Telemetry] Device ${ctx.deviceId} time not synced (time=${payload?.time}), using server time`,
    )
  }

  await enqueueEcgInferenceJob({
    deviceId: ctx.deviceId,
    patientId: ctx.patientId,
    packetEcg,
    timestampMs,
  })
}
