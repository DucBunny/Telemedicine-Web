import { Appointment, Doctor, Patient, User } from '@/models/sql/index'

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

  const whereClause = { ...where }

  if (status.length > 0) {
    whereClause.status = status
  }

  const { rows, count } = await Appointment.findAndCountAll({
    where: whereClause,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['scheduled_at', 'DESC']]
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
 * Find appointments by doctor ID
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

/**
 * Find appointments by patient ID
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
