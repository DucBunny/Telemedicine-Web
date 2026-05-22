import { StatusCodes } from 'http-status-codes'
import { sequelize } from '@/models/sql'
import * as appointmentRepo from '@/repositories/appointment.repo'
import * as medicalRecordRepo from '@/repositories/medicalRecord.repo'
import ApiError from '@/utils/api-error'

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
  return record
}

/**
 * Get medical records by patient ID and doctor ID
 */
export const getMedicalRecordByPatientIdAndDoctorId = async (
  patientId,
  doctorId,
  { page, limit, createdFrom, createdTo },
) => {
  return await medicalRecordRepo.findByPatientIdAndDoctorId(
    patientId,
    doctorId,
    { page, limit, createdFrom, createdTo },
  )
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
