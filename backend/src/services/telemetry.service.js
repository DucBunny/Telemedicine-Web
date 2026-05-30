import {
  clearThrottledAlertId,
  getThrottledAlertId,
  refreshThrottleTTL,
  setThrottledAlertId,
} from '@/cache/alertThrottle.cache'
import { enqueueEcgRawPacket } from '@/cache/ecgRaw.cache'
import { env } from '@/config'
import { schedulePersistAbnormalStripJob } from '@/jobs/ecgAbnormalStrip.queue'
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

// Xây dựng document ECG raw cho MongoDB
const buildEcgRawDocument = (ctx, data, timestamp) => {
  const packetEcg = data?.packet_ecg
  const classInference = String(data?.class_inference || 'N').toUpperCase()

  if (
    !Array.isArray(packetEcg) ||
    packetEcg.length !== Number.parseInt(env.ECG_PACKET_SIZE, 10)
  )
    return null

  return {
    timestamp,
    metadata: {
      patient_id: ctx.patientId,
      device_id: ctx.deviceId,
    },
    ecg_packet: packetEcg,
    class_inference: classInference,
    is_abnormal: classInference !== 'N',
  }
}

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
 * Đẩy gói ECG lên /monitor (dùng cho cả N và bất thường để UI vẽ waveform)
 */
const emitEcgToMonitor = async (ctx, data, mqttTime) => {
  const {
    packet_ecg: packetEcg,
    class_inference: classInference,
    time_inference: timeInference,
  } = data

  if (
    !Array.isArray(packetEcg) ||
    packetEcg.length !== Number.parseInt(env.ECG_PACKET_SIZE, 10)
  )
    return

  const timestamp = mqttTime ? new Date(mqttTime) : new Date()

  emitEcgPacketToPatientMonitor(ctx.patientId, {
    deviceId: ctx.deviceId,
    packetEcg,
    classInference: classInference || 'N',
    timeInference: timeInference ?? null,
    timestamp,
  })

  try {
    const ecgRawDocument = buildEcgRawDocument(ctx, data, timestamp)
    if (ecgRawDocument) await enqueueEcgRawPacket(ecgRawDocument)
  } catch (error) {
    console.error('[Telemetry] Failed to buffer ECG raw packet:', error)
  }
}

/**
 * Stream ECG bình thường → namespace /monitor
 */
const handleNormalTelemetry = async (ctx, data, mqttTime) => {
  await emitEcgToMonitor(ctx, data, mqttTime)

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
 * ECG bất thường — alert + throttle Redis + socket/email
 */
const handleAbnormalTelemetry = async (ctx, data, mqttTime) => {
  await emitEcgToMonitor(ctx, data, mqttTime)

  const classInference = String(data.class_inference || '').toUpperCase()
  const alertType = alertTypeFromClass(classInference)
  const now = mqttTime ? new Date(mqttTime) : new Date()
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
 * Xử lý gói telemetry từ MQTT (dac_ta_ban_tin_en.md)
 */
export const processTelemetryMessage = async (payload) => {
  // if (payload?.content !== 'telemetry') return

  const data = payload.data
  // const data = payload
  if (!data) return

  const ctx = await resolveDeviceContext(data)
  if (!ctx) {
    console.warn('[Telemetry] Device not found or unassigned:', data.id)
    return
  }

  const classInference = String(data.class_inference).toUpperCase()

  if (classInference === 'N') {
    await handleNormalTelemetry(ctx, data, payload.time)
    return
  }

  await handleAbnormalTelemetry(ctx, data, payload.time)
}
