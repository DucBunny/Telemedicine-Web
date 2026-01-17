import { User, Doctor, Patient } from '@/models/sql/index'
import { Op } from 'sequelize'

/**
 * Get all doctors with pagination
 */
export const getAll = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit
  const whereClause = {}

  if (search) {
    whereClause[Op.or] = [
      { '$User.fullName$': { [Op.like]: `%${search}%` } },
      { specialty: { [Op.like]: `%${search}%` } },
      { '$User.email$': { [Op.like]: `%${search}%` } }
    ]
  }

  const { rows, count } = await Doctor.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        attributes: ['id', 'fullName', 'email', 'phoneNumber', 'role']
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  })

  return {
    data: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  }
}

/**
 * Get doctor by ID
 */
export const findById = async (id) => {
  return await Doctor.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ['id', 'fullName', 'email', 'phoneNumber', 'role']
      }
    ]
  })
}

/**
 * Get doctor by user ID
 */
export const findByUserId = async (userId) => {
  return await Doctor.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ['id', 'fullName', 'email', 'phoneNumber', 'role']
      }
    ]
  })
}

/**
 * Create new doctor
 */
export const create = async (data) => {
  return await Doctor.create(data)
}

/**
 * Update doctor
 */
export const update = async (id, data) => {
  const doctor = await Doctor.findByPk(id)
  if (!doctor) return null

  return await doctor.update(data)
}

/**
 * Delete doctor
 */
export const deleteDoctor = async (id) => {
  return await Doctor.destroy({ where: { id } })
}

/**
 * Get doctor's patients
 */
export const getDoctorPatients = async (doctorId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit

  const doctor = await Doctor.findByPk(doctorId, {
    include: [
      {
        model: Patient,
        as: 'Patients',
        include: [
          {
            model: User,
            attributes: ['id', 'fullName', 'email', 'phoneNumber']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    ]
  })

  if (!doctor) return null

  // Count total patients for this doctor
  const totalPatients = await doctor.countPatients()

  return {
    data: doctor.Patients,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalPatients,
      totalPages: Math.ceil(totalPatients / limit)
    }
  }
}
