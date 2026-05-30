import { StatusCodes } from 'http-status-codes'
import { enqueueMedicalReportJob } from '@/jobs/medicalReport.queue'
import { sequelize } from '@/models/sql'
import * as alertRepo from '@/repositories/alert.repo'
import * as appointmentRepo from '@/repositories/appointment.repo'
import * as ecgAbnormalStripRepo from '@/repositories/ecgAbnormalStrip.repo'
import * as medicalAttachmentRepo from '@/repositories/medicalAttachment.repo'
import * as medicalRecordRepo from '@/repositories/medicalRecord.repo'
import * as patientDoctorRepo from '@/repositories/patientDoctor.repo'
import ApiError from '@/utils/api-error'

/**
 * Serialize ECG strip data for response
 */
const serializeEcgStrip = (strip) => ({
  id: strip?._id?.toString?.() ?? null,
  stripType: strip.strip_type,
  referenceTimestamp: strip.reference_timestamp,
  windowStart: strip.window_start,
  windowEnd: strip.window_end,
  durationSeconds: strip.duration_seconds,
  ecgData: Array.isArray(strip.ecg_data) ? strip.ecg_data : [],
  detectedClasses: Array.isArray(strip.detected_classes)
    ? strip.detected_classes
    : [],
})

/**
 * Attach ECG strips to medical record
 */
const attachEcgStripsToRecord = async (record) => {
  if (!record?.alertId) {
    if (typeof record?.setDataValue === 'function')
      record.setDataValue('ecgAbnormalStrips', [])
    return record
  }

  const strips = await ecgAbnormalStripRepo.findByAlertId(record.alertId)
  const serializedStrips = strips.map(serializeEcgStrip)

  if (typeof record.setDataValue === 'function') {
    record.setDataValue('ecgAbnormalStrips', serializedStrips)
    return record
  }

  record.ecgAbnormalStrips = serializedStrips
  return record
}

/**
 * Get medical records for logged in user (doctor or patient) with pagination
 */
export const getMyMedicalRecords = async (
  userId,
  role,
  { page, limit, search },
) => {
  if (role === 'doctor') {
    return await medicalRecordRepo.findByDoctorId(userId, {
      page,
      limit,
    })
  } else if (role === 'patient') {
    return await medicalRecordRepo.findByPatientId(userId, {
      page,
      limit,
      search,
    })
  }
}

/**
 * Get medical record by ID
 */
export const getMedicalRecordById = async (recordId) => {
  const record = await medicalRecordRepo.findById(recordId)
  if (!record) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Medical record not found',
      'RECORD_NOT_FOUND',
    )
  }
  return await attachEcgStripsToRecord(record)
}

/**
 * Request export of a dynamic ECG report PDF.
 */
export const exportMedicalReport = async ({
  medicalRecordId,
  alertId,
  requesterDoctorId,
}) => {
  const sourceType = medicalRecordId ? 'medical_record' : 'alert'
  let record = null
  let alert = null

  if (medicalRecordId) {
    record = await medicalRecordRepo.findById(medicalRecordId)

    if (!record)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Medical record not found',
        'RECORD_NOT_FOUND',
      )
  }

  const resolvedAlertId = record?.alertId ?? alertId ?? null

  if (record?.alertId && alertId && Number(record.alertId) !== Number(alertId))
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Alert does not match the provided medical record',
      'ALERT_RECORD_MISMATCH',
    )

  if (resolvedAlertId) {
    alert = await alertRepo.findById(resolvedAlertId)

    if (!alert)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Alert not found',
        'ALERT_NOT_FOUND',
      )
  }

  if (!record && !alert)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'A medicalRecordId or alertId is required',
      'REPORT_SOURCE_REQUIRED',
    )

  const cachedAttachment = await medicalAttachmentRepo.findAutoEcgReport({
    sourceType,
    medicalRecordId: record?.id ?? medicalRecordId ?? null,
    alertId: resolvedAlertId,
  })

  if (cachedAttachment) {
    return {
      status: 'ready',
      cached: true,
      fileUrl: cachedAttachment.fileUrl,
      fileName: cachedAttachment.fileName,
      message: 'Báo cáo đã sẵn sàng.',
    }
  }

  await enqueueMedicalReportJob({
    sourceType,
    medicalRecordId: record?.id ?? medicalRecordId ?? null,
    alertId: resolvedAlertId,
    requesterDoctorId,
  })

  return {
    status: 'queued',
    cached: false,
    message: 'Đang tạo báo cáo...',
  }
}

/**
 * Get medical records by patient ID and doctor ID
 */
export const getMedicalRecordByPatientIdAndDoctorId = async (
  patientId,
  doctorId,
  { page, limit, createdFrom, createdTo, doctorIdQuery },
) => {
  const hasRelation = await patientDoctorRepo.hasRelation(patientId, doctorId)
  if (!hasRelation)
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to access this medical records',
      'FORBIDDEN',
    )

  return await medicalRecordRepo.findByPatientIdAndDoctorId(patientId, {
    page,
    limit,
    createdFrom,
    createdTo,
    doctorIdQuery,
  })
}

/**
 * Create medical record linked to an appointment (transaction).
 */
export const createMedicalRecordForAppointment = async (doctorId, data) => {
  const { appointmentId, patientId, ...recordFields } = data

  const result = await sequelize.transaction(async (t) => {
    const appointment = await appointmentRepo.findById(appointmentId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    })

    if (!appointment) return { type: 'APPOINTMENT_NOT_FOUND' }

    if (Number(appointment.doctorId) !== Number(doctorId))
      return { type: 'FORBIDDEN' }

    if (Number(appointment.patientId) !== Number(patientId))
      return { type: 'PATIENT_MISMATCH' }

    if (appointment.status !== 'confirmed') return { type: 'INVALID_STATUS' }

    const existingRecord = await medicalRecordRepo.findByAppointmentId(
      appointmentId,
      { transaction: t },
    )
    if (existingRecord) return { type: 'RECORD_EXISTS' }

    const medicalRecord = await medicalRecordRepo.create(
      {
        appointmentId,
        patientId,
        doctorId,
        ...recordFields,
      },
      { transaction: t },
    )

    return { type: 'SUCCESS', medicalRecord }
  })

  if (result.type === 'APPOINTMENT_NOT_FOUND')
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Appointment not found',
      'APPOINTMENT_NOT_FOUND',
    )

  if (result.type === 'FORBIDDEN')
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot create a record for this appointment',
      'FORBIDDEN',
    )

  if (result.type === 'PATIENT_MISMATCH')
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Patient does not match appointment',
      'PATIENT_MISMATCH',
    )

  if (result.type === 'INVALID_STATUS')
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Medical record can only be created for confirmed appointments',
      'INVALID_APPOINTMENT_STATUS',
    )

  if (result.type === 'RECORD_EXISTS')
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Medical record for this appointment already exists',
      'MEDICAL_RECORD_EXISTS',
    )

  return result.medicalRecord
}

/**
 * Create new medical record (appointment-linked uses transaction path).
 */
export const createMedicalRecord = async (data) => {
  if (data.appointmentId != null)
    return await createMedicalRecordForAppointment(data.doctorId, data)

  return await medicalRecordRepo.create(data)
}

/**
 * Update medical record by ID
 */
export const updateMedicalRecord = async (recordId, data) => {
  const record = await medicalRecordRepo.findById(recordId)

  if (!record)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Medical record not found',
      'RECORD_NOT_FOUND',
    )

  if (
    data.doctorId != null &&
    Number(record.doctorId) !== Number(data.doctorId)
  )
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot update this medical record',
      'FORBIDDEN',
    )

  const { doctorId: _doctorId, ...patch } = data
  return await medicalRecordRepo.update(recordId, patch)
}
