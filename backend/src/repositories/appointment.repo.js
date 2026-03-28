import {
  Appointment,
  Doctor,
  Patient,
  User,
  Specialty,
  Sequelize,
  DoctorWorkingHours,
  DoctorOffSchedule,
  PatientDoctor
} from '@/models/sql/index'
import { Op } from 'sequelize'

/**
 * Generic function to find appointments by owner (doctor or patient)
 */
const findByOwner = async ({
  where,
  include,
  page = 1,
  limit = 10,
  status = []
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

  const { rows, count } = await Appointment.findAndCountAll({
    where: whereClause,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [
      [Sequelize.literal(statusOrder), 'ASC'],
      ['scheduled_at', 'ASC'],
      ['id', 'ASC']
    ]
  })

  return {
    data: rows,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  }
}

/**
 * Find doctor's appointments by doctor ID
 */
export const findByDoctorId = async (
  doctorId,
  { page = 1, limit = 10, status = [] }
) => {
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
            attributes: ['fullName', 'avatar']
          }
        ]
      }
    ],
    page,
    limit,
    status
  })
}

/**
 * Find patient's appointments by patient ID
 */
export const findByPatientId = async (
  patientId,
  { page = 1, limit = 10, status = [] }
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
            attributes: ['fullName', 'avatar']
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: ['name']
          }
        ]
      }
    ],
    page,
    limit,
    status
  })
}

/**
 * Find appointment by ID
 */
export const findById = async (id) => {
  return await Appointment.findByPk(id)
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
export const update = async (appointmentId, data) => {
  const [updated] = await Appointment.update(data, {
    where: { id: appointmentId }
  })
  return updated > 0 ? await Appointment.findByPk(appointmentId) : null
}

/**
 * Get doctor's working hours for a specific day of week
 */
export const getWorkingHours = async (doctorId, dayOfWeek) => {
  return await DoctorWorkingHours.findAll({
    where: { doctorId, dayOfWeek }
  })
}

/**
 * Get doctor's off schedules for a specific date
 */
export const getOffSchedules = async (doctorId, date) => {
  return await DoctorOffSchedule.findAll({
    where: { doctorId, offDate: date }
  })
}

/**
 * Get booked appointments (pending/confirmed) for a doctor on a specific date
 */
export const getBookedAppointments = async (doctorId, date) => {
  const startOfDay = new Date(`${date}T00:00:00`)
  const endOfDay = new Date(`${date}T23:59:59.999`)

  return await Appointment.findAll({
    where: {
      doctorId,
      scheduledAt: {
        [Op.between]: [startOfDay, endOfDay]
      },
      status: ['pending', 'confirmed']
    },
    attributes: ['scheduledAt', 'durationMinutes']
  })
}

/**
 * Ensure patient-doctor relationship exists
 * Đảm bảo mối quan hệ bệnh nhân-bác sĩ tồn tại, nếu chưa có thì tạo mới với vai trò 'primary' và ngày gán là ngày hiện tại
 */
export const ensurePatientDoctor = async (patientId, doctorId) => {
  const [record] = await PatientDoctor.findOrCreate({
    where: { patientId, doctorId },
    defaults: {
      patientId,
      doctorId,
      role: 'primary',
      assignedAt: new Date()
    }
  })
  return record
}
