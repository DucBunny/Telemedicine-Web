import { Doctor, Patient, User, MedicalRecord } from '@/models/index'

/**
 * Generic function to find medical records by owner (doctor or patient)
 */
const findByOwner = async ({ where, include, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit

  const whereClause = { ...where }

  const { rows, count } = await MedicalRecord.findAndCountAll({
    where: whereClause,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset)
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
            attributes: ['fullName']
          }
        ]
      }
    ],
    page,
    limit
  })
}

/**
 * Find medical records by patient ID
 */
export const findByPatientId = async (patientId, { page = 1, limit = 10 }) => {
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
    limit
  })
}
