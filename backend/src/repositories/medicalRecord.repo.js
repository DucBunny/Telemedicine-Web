import { Op } from 'sequelize'
import {
  Alert,
  Appointment,
  Doctor,
  MedicalAttachment,
  MedicalRecord,
  Patient,
  Specialty,
  User,
} from '@/models/sql/index'
import { caseInsensitiveSearch } from '@/utils/search-case-insensitive'

/**
 * Generic function to find medical records by owner (doctor or patient)
 */
const findByOwner = async ({
  where,
  include,
  attributes,
  page = 1,
  limit = 10,
}) => {
  const offset = (page - 1) * limit

  const includeOptions = [...include]

  const { rows, count } = await MedicalRecord.findAndCountAll({
    where,
    include: includeOptions,
    attributes,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
    subQuery: false,
    distinct: true,
    col: 'id',
  })

  return {
    data: rows,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  }
}

/**
 * Find medical records by doctor ID
 */
export const findByDoctorId = async (doctorId, { page = 1, limit = 10 }) => {
  return await findByOwner({
    where: { doctorId },
    include: [
      {
        model: Patient,
        as: 'patient',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'avatar'],
          },
        ],
      },
    ],
    page,
    limit,
  })
}

/**
 * Find medical records by patient ID
 */
export const findByPatientId = async (
  patientId,
  { page = 1, limit = 10, search = '' },
) => {
  return await findByOwner({
    where: {
      patientId,
      ...(search?.trim().toLowerCase() && {
        [Op.or]: [
          caseInsensitiveSearch('doctor.user.full_name', search),
          caseInsensitiveSearch('diagnosis', search),
          caseInsensitiveSearch('doctor.specialty.name', search),
        ],
      }),
    },
    include: [
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['degree'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'avatar'],
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: ['name'],
          },
        ],
      },
    ],
    page,
    limit,
  })
}

/**
 * Find medical records by patient ID and doctor ID
 */
export const findByPatientIdAndDoctorId = async (
  patientId,
  doctorId,
  { page = 1, limit = 10, createdFrom, createdTo },
) => {
  const whereClause = {}
  if (createdFrom || createdTo) {
    whereClause.createdAt = {}
    if (createdFrom) whereClause.createdAt[Op.gte] = new Date(createdFrom)
    if (createdTo) whereClause.createdAt[Op.lte] = new Date(createdTo)
  }

  return await findByOwner({
    where: {
      patientId,
      doctorId,
      ...whereClause,
    },
    include: [],
    page,
    limit,
  })
}

/**
 * Find medical record by ID
 */
export const findById = async (recordId) => {
  return await MedicalRecord.findByPk(recordId, {
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'avatar'],
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: ['name'],
          },
        ],
      },
      {
        model: Appointment,
        as: 'appointment',
        attributes: ['id', 'scheduledAt'],
      },
      {
        model: Alert,
        as: 'alert',
        attributes: ['id', 'resolvedAt'],
      },
      {
        model: MedicalAttachment,
        as: 'medicalAttachments',
      },
      {
        model: Patient,
        as: 'patient',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'avatar'],
          },
        ],
      },
    ],
  })
}

/**
 * Find medical record by alert ID
 */
export const findByAlertId = async (alertId, options = {}) => {
  return await MedicalRecord.findOne({
    where: { alertId },
    ...options,
  })
}

/**
 * Find medical record by appointment ID
 */
export const findByAppointmentId = async (appointmentId, options = {}) => {
  return await MedicalRecord.findOne({
    where: { appointmentId },
    ...options,
  })
}

/**
 * Create new medical record
 */
export const create = async (data, options = {}) => {
  return await MedicalRecord.create(data, options)
}

/**
 * Update medical record by ID
 */
export const update = async (recordId, data) => {
  const [updated] = await MedicalRecord.update(data, {
    where: { id: recordId },
  })

  return updated > 0 ? await MedicalRecord.findByPk(recordId) : null
}
