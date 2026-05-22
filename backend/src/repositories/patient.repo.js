import { Op } from 'sequelize'
import { Doctor, Patient, Sequelize, User } from '@/models/sql/index'
import { caseInsensitiveSearch } from '@/utils/search-case-insensitive'

/**
 * Get patient by user ID
 */
export const findByUserId = async (userId, options = {}) => {
  return await Patient.findByPk(userId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'phoneNumber', 'role', 'avatar'],
      },
    ],
    ...options,
  })
}

/**
 * Create new patient
 */
export const create = async (data, options = {}) => {
  return await Patient.create(data, options)
}

/**
 * Update patient
 */
export const update = async (userId, data, options = {}) => {
  const [updated] = await Patient.update(data, {
    where: { userId },
    ...options,
  })
  return updated > 0 ? await findByUserId(userId, options) : null
}

/**
 * Get doctor's patients by doctor ID
 */
export const findByDoctorId = async (
  doctorId,
  { page = 1, limit = 10, search, bloodType, gender, dobFrom, dobTo },
) => {
  const offset = (page - 1) * limit

  const whereClause = {}

  if (search?.trim().toLowerCase()) {
    whereClause[Op.or] = [caseInsensitiveSearch('user.full_name', search)]
  }

  if (bloodType) {
    whereClause.bloodType = bloodType
  }

  if (gender) {
    whereClause.gender = gender
  }

  if (dobFrom || dobTo) {
    whereClause.dateOfBirth = {}
    if (dobFrom) whereClause.dateOfBirth[Op.gte] = new Date(dobFrom)
    if (dobTo) whereClause.dateOfBirth[Op.lte] = new Date(dobTo)
  }

  const { rows, count } = await Patient.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'avatar', 'phoneNumber'],
      },
      {
        model: Doctor,
        as: 'doctors',
        attributes: [],
        where: { user_id: doctorId },
        required: true, // Inner join to filter patients by doctor
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    subQuery: false, // To fix incorrect LIMIT with include
    distinct: true, // To get correct count when using include
    col: 'user_id', // To ensure correct counting
    order: [['user_id', 'ASC']],
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
