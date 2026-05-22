import { StatusCodes } from 'http-status-codes'
import { clearThrottledAlertId } from '@/cache/alert-throttle.cache'
import { sequelize } from '@/models/sql'
import * as alertRepo from '@/repositories/alert.repo'
import * as medicalRecordRepo from '@/repositories/medicalRecord.repo'
import * as patientDoctorRepo from '@/repositories/patientDoctor.repo'
import {
  emitAlertNewToDoctors,
  emitAlertUpdateToDoctors,
} from '@/sockets/emitters/system.emitters'
import ApiError from '@/utils/api-error'

/**
 * Serialize alert payload to JSON
 * @param {object} alert
 * @returns {object} serializedAlert
 * @example
 * const serializedAlert = serializeAlertPayload(alert) => { id: 1, type: 'bpm', value: 150,...}
 */
const serializeAlertPayload = (alert) => {
  if (!alert) return null
  const json = typeof alert.toJSON === 'function' ? alert.toJSON() : alert
  return json
}

/**
 * Get recipient doctor IDs
 * @param {number} alertId
 * @param {number} patientId
 * @returns {number[]} doctorIds
 * @example
 * const doctorIds = await getRecipientDoctorIds(alertId, patientId) => [1, 2, 3]
 */
const getRecipientDoctorIds = async (alertId, patientId) => {
  // Get recipient doctor IDs from alert recipients
  const fromRecipients = await alertRepo.findRecipientDoctorIds(alertId)
  if (fromRecipients.length > 0) return fromRecipients.map((r) => r.doctorId)

  // Get recipient doctor IDs from patient doctor relations if not found in alert recipients
  const relations = await patientDoctorRepo.getDoctorIdsByPatientId(patientId)
  return relations.map((r) => r.doctorId)
}

/**
 * Broadcast alert updated to doctors
 */
const broadcastAlertUpdated = async (alert) => {
  const payload = serializeAlertPayload(alert)
  if (!payload) return
  const doctorIds = await getRecipientDoctorIds(alert.id, alert.patientId)
  emitAlertUpdateToDoctors(doctorIds, payload)
}

/**
 * Notify doctors about a new alert (call after alert + recipients are created)
 */
export const notifyAlertCreated = async (alert) => {
  const payload = serializeAlertPayload(alert)
  if (!payload) return
  const doctorIds = await getRecipientDoctorIds(alert.id, alert.patientId)
  emitAlertNewToDoctors(doctorIds, payload)
}

/**
 * Get doctor's alerts
 */
export const getAlertsByDoctorId = async (
  doctorId,
  { page, limit, search, status, handledBy, createdFrom, createdTo },
) => {
  return await alertRepo.findByDoctorId(doctorId, {
    page,
    limit,
    search,
    status,
    handledBy,
    createdFrom,
    createdTo,
  })
}

/**
 * Get patient's health history
 */
export const getHealthHistoryByPatientId = async (
  patientId,
  { page, limit },
) => {
  return await alertRepo.findByPatientId(patientId, { page, limit })
}

/**
 * Assert that the doctor is a recipient of the alert
 */
const assertDoctorRecipient = async (alertId, doctorId) => {
  const isRecipient = await alertRepo.isDoctorRecipient(alertId, doctorId)
  if (!isRecipient)
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not a recipient of this alert',
      'FORBIDDEN',
    )
}

/**
 * Mark alert as read for current doctor
 */
export const markAlertAsRead = async (alertId, doctorId) => {
  await assertDoctorRecipient(alertId, doctorId)
  return await alertRepo.markRecipientAsRead(alertId, doctorId)
}

/**
 * Claim alert handling
 */
export const claimAlertHandling = async (alertId, doctorId) => {
  await assertDoctorRecipient(alertId, doctorId)

  const updated = await alertRepo.claimHandling(alertId, doctorId)
  if (!updated)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'This alert is already being handled by another doctor',
      'ALERT_ALREADY_HANDLED',
    )

  await broadcastAlertUpdated(updated)
  return updated
}

/**
 * Release alert handling back to pending (e.g. doctor ended call without resolve)
 */
export const releaseAlertHandling = async (alertId, doctorId) => {
  await assertDoctorRecipient(alertId, doctorId)

  const updated = await alertRepo.releaseHandling(alertId, doctorId)
  if (!updated) return null

  await broadcastAlertUpdated(updated)
  return updated
}

/**
 * Resolve alert and create medical record
 * Chốt ca sau cuộc gọi - Chỉ khi đã có hồ sơ bệnh án lưu cho cảnh báo đó.
 */
export const resolveAlert = async (
  alertId,
  doctorId,
  medicalRecordData = {},
) => {
  await assertDoctorRecipient(alertId, doctorId)

  const result = await sequelize.transaction(async (t) => {
    const alert = await alertRepo.findHandlingByDoctor(alertId, doctorId, {
      transaction: t,
      lock: t.LOCK.UPDATE, // To prevent race condition for updating alert
    })
    if (!alert) return { type: 'NOT_FOUND' }

    const existingRecord = await medicalRecordRepo.findByAlertId(alertId, {
      transaction: t,
    })
    if (existingRecord) return { type: 'RECORD_EXISTS' }

    await alertRepo.resolve(alertId, { transaction: t })

    const medicalRecord = await medicalRecordRepo.create(
      {
        alertId: alert.id,
        patientId: alert.patientId,
        doctorId,
        symptoms: medicalRecordData.symptoms ?? '',
        diagnosis: medicalRecordData.diagnosis ?? '',
        treatmentPlan: medicalRecordData.treatmentPlan ?? null,
        notes: medicalRecordData.notes ?? null,
        prescription: medicalRecordData.prescription ?? null,
      },
      { transaction: t },
    )

    const updatedAlert = await alertRepo.findById(alertId, {
      transaction: t,
    })
    return { type: 'SUCCESS', alert: updatedAlert, medicalRecord }
  })

  if (result.type === 'NOT_FOUND')
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Alert not found or not being handled by you',
      'ALERT_RESOLVE_FAILED',
    )

  if (result.type === 'RECORD_EXISTS')
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Medical record for this alert already exists',
      'MEDICAL_RECORD_EXISTS',
    )

  // Xóa throttle alert để cho phép tạo alert mới nếu tái phát
  await clearThrottledAlertId(result.alert.patientId, result.alert.type)

  // Gửi alert updated đến bác sĩ nhận thông báo
  await broadcastAlertUpdated(result.alert)
  return {
    alert: result.alert,
    medicalRecord: result.medicalRecord,
  }
}
