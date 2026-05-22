import { endOfDay, parse, startOfDay } from 'date-fns'
import { Op } from 'sequelize'
import {
  Appointment,
  Doctor,
  DoctorOffSchedule,
  DoctorWorkingHours,
  Patient,
  Sequelize,
  Specialty,
  User,
} from '@/models/sql/index'
import { caseInsensitiveSearch } from '@/utils/search-case-insensitive'

/**
 * Generic function to find appointments by owner (doctor or patient)
 */
const findByOwner = async ({
  where,
  include,
  page = 1,
  limit = 10,
  status = [],
  type,
  scheduledFrom,
  scheduledTo,
}) => {
  const offset = (page - 1) * limit
  const statusOrder = `
    CASE
      WHEN status = 'pending' THEN 1
      WHEN status = 'confirmed' THEN 2
      WHEN status = 'completed' THEN 3
      WHEN status = 'cancelled' THEN 4
      ELSE 5
    END
  `

  const whereClause = { ...where }

  if (status.length > 0) {
    whereClause.status = status
  }

  if (type) {
    whereClause.type = type
  }

  if (scheduledFrom || scheduledTo) {
    whereClause.scheduledAt = {}
    if (scheduledFrom) whereClause.scheduledAt[Op.gte] = new Date(scheduledFrom)
    if (scheduledTo) whereClause.scheduledAt[Op.lte] = new Date(scheduledTo)
  }

  const { rows, count } = await Appointment.findAndCountAll({
    where: whereClause,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [
      [Sequelize.literal(statusOrder), 'ASC'],
      ['scheduled_at', 'ASC'],
      ['id', 'ASC'],
    ],
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
 * Find doctor's appointments by doctor ID
 */
export const findByDoctorId = async (
  doctorId,
  {
    page = 1,
    limit = 10,
    status = [],
    type,
    scheduledFrom,
    scheduledTo,
    search,
  },
) => {
  return await findByOwner({
    where: {
      doctorId,
      ...(search?.trim().toLowerCase() && {
        [Op.or]: [caseInsensitiveSearch('patient.user.full_name', search)],
      }),
    },
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
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['address'],
      },
    ],
    page,
    limit,
    status,
    type,
    scheduledFrom,
    scheduledTo,
  })
}

/**
 * Find patient's appointments by patient ID
 */
export const findByPatientId = async (
  patientId,
  { page = 1, limit = 10, status = [] },
) => {
  return await findByOwner({
    where: { patientId },
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
    ],
    page,
    limit,
    status,
  })
}

/**
 * Find appointments by patient ID and doctor ID
 */
export const findByPatientIdAndDoctorId = async (
  patientId,
  doctorId,
  { page = 1, limit = 10, status = [], type, scheduledFrom, scheduledTo },
) => {
  return await findByOwner({
    where: { patientId, doctorId },
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
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['address'],
      },
    ],
    page,
    limit,
    status,
    type,
    scheduledFrom,
    scheduledTo,
  })
}

/**
 * Find appointment by ID
 */
export const findById = async (appointmentId, options = {}) => {
  return await Appointment.findByPk(appointmentId, options)
}

/**
 * Find appointment by ID with patient + doctor (for telehealth visit panel).
 */
export const findByIdWithRelations = async (appointmentId) => {
  return await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: Patient,
        as: 'patient',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'avatar'],
          },
        ],
      },
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['userId', 'degree', 'address'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'avatar'],
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: ['name'],
          },
        ],
      },
    ],
  })
}

/**
 * Create a new appointment
 */
export const create = async (data) => {
  return await Appointment.create(data)
}

/**
 * Update an existing appointment
 */
export const update = async (appointmentId, data, options = {}) => {
  const [updated] = await Appointment.update(data, {
    where: { id: appointmentId },
    ...options,
  })

  return updated > 0 ? await findById(appointmentId, options) : null
}

/**
 * Get doctor's working hours for a specific day of week
 */
export const getWorkingHours = async (doctorId, dayOfWeek) => {
  return await DoctorWorkingHours.findAll({
    where: { doctorId, dayOfWeek },
  })
}

/**
 * Get doctor's off schedules for a specific date
 */
export const getOffSchedules = async (doctorId, date) => {
  return await DoctorOffSchedule.findAll({
    where: { doctorId, offDate: date },
  })
}

/**
 * Get booked appointments (pending/confirmed) for a doctor on a specific date
 */
export const getBookedAppointments = async (doctorId, date) => {
  const localDate = parse(date, 'yyyy-MM-dd', new Date())
  const startOfDayVal = startOfDay(localDate)
  const endOfDayVal = endOfDay(localDate)

  return await Appointment.findAll({
    where: {
      doctorId,
      scheduledAt: {
        [Op.between]: [startOfDayVal, endOfDayVal],
      },
      status: ['pending', 'confirmed'],
    },
    attributes: ['scheduledAt', 'durationMinutes'],
  })
}

/**
 * Pending appointments whose scheduled start is strictly before `before` (đã quá giờ hẹn).
 */
export const findPendingScheduledBefore = async (before) => {
  return await Appointment.findAll({
    where: {
      status: 'pending',
      scheduledAt: { [Op.lt]: before },
    },
    attributes: [
      'id',
      'patientId',
      'doctorId',
      'scheduledAt',
      'durationMinutes',
      'type',
    ],
  })
}
