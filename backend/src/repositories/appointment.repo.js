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
  const startOfDay = new Date(`${date}T00:00:00.000Z`)
  const endOfDay = new Date(`${date}T23:59:59.999Z`)

  return await Appointment.findAll({
    where: {
      doctorId,
      scheduledAt: {
        [Sequelize.Op.between]: [startOfDay, endOfDay]
      },
      status: ['pending', 'confirmed']
    },
    attributes: ['scheduledAt', 'duration']
  })
}

/**
 * Book a new appointment
 */
export const bookAppointment = async ({
  patientId,
  doctorId,
  scheduledAt,
  reason,
  duration = 30
}) => {
  return await Appointment.create({
    patientId,
    doctorId,
    scheduledAt,
    reason,
    duration,
    status: 'pending'
  })
}

/**
 * Find appointment by ID
 */
export const findById = async (id) => {
  return await Appointment.findByPk(id)
}

/**
 * Update appointment status
 */
export const updateStatus = async (id, status) => {
  const [, [updated]] = await Appointment.update(
    { status },
    { where: { id }, returning: true }
  )
  return updated ?? (await Appointment.findByPk(id))
}

/**
 * Ensure patient-doctor relationship exists
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
