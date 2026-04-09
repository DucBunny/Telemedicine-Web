import { User, Doctor, Specialty, Patient } from '@/models/sql/index'
import { Op } from 'sequelize'
import { caseInsensitiveSearch } from '@/utils/search-case-insensitive'

/**
 * Get doctor by user ID
 */
export const findByUserId = async (userId) => {
  return await Doctor.findByPk(userId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'phoneNumber', 'role', 'avatar']
      },
      {
        model: Specialty,
        as: 'specialty',
        attributes: ['name']
      }
    ]
  })
}

/**
 * Get all doctors with pagination, optional search and filter
 */
export const getAll = async ({
  page = 1,
  limit = 10,
  search = '',
  specialtyId = null
}) => {
  const offset = (page - 1) * limit
  const whereClause = {}
  const searchKeyword = search?.trim().toLowerCase()

  if (specialtyId) {
    whereClause.specialtyId = specialtyId
  }

  if (searchKeyword) {
    whereClause[Op.or] = [
      caseInsensitiveSearch('user.full_name', searchKeyword),
      caseInsensitiveSearch('address', searchKeyword)
    ]
  }

  const { rows, count } = await Doctor.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'avatar'],
        required: Boolean(searchKeyword)
      },
      {
        model: Specialty,
        as: 'specialty',
        attributes: ['name']
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['experienceYears', 'DESC']],
    subQuery: false,
    distinct: true,
    col: 'user_id'
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

// ------------------------------------------------------------

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
        as: 'patients',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'email', 'phoneNumber']
          }
        ]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset)
  })

  if (!doctor) return null

  // Count total patients for this doctor
  const totalPatients = await doctor.countPatients()

  return {
    data: doctor.patients,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalPatients,
      totalPages: Math.ceil(totalPatients / limit)
    }
  }
}
