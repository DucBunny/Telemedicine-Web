import {
  Appointment,
  Doctor,
  Patient,
  User,
  Sequelize
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
            attributes: ['fullName']
          }
        ]
      }
    ],
    page,
    limit,
    status
  })
}
