import { Op } from 'sequelize'
import { User } from '@/models/sql/index'

/**
 * Create new user
 */
export const create = async (data, options = {}) => {
  return await User.create(data, options)
}

/**
 * Update user by ID
 */
export const update = async (id, data, options = {}) => {
  const [updated] = await User.update(data, { where: { id }, ...options })
  return updated > 0 ? await findByIdExcludePassword(id) : null
}

/**
 * Find user by ID
 */
export const findById = async (id) => {
  return await User.findByPk(id)
}

/**
 * Find user by ID excluding password
 */
export const findByIdExcludePassword = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  })
}

/**
 * Find user by email
 */
export const findByEmail = async (email) => {
  return await User.findOne({ where: { email } })
}

/**
 * Find user by phone number
 */
export const findByPhoneNumber = async (phoneNumber) => {
  return await User.findOne({ where: { phoneNumber } })
}

/**
 * Get user's name by ID
 */
export const getNameById = async (id) => {
  return await User.findByPk(id, {
    attributes: { include: ['fullName'] },
  })
}

/**
 * Get all users with pagination, optional search and filter
 */
export const getAll = async ({
  page = 1,
  limit = 10,
  search = '',
  role = '',
}) => {
  const offset = (page - 1) * limit
  const whereClause = {}

  if (search) {
    whereClause[Op.or] = [
      { fullName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } },
    ]
  }

  if (role) {
    whereClause.role = role
  }

  const { rows, count } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset: parseInt(offset),
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
 * Delete user by ID
 */
export const deleteById = async (id) => {
  return await User.destroy({ where: { id } })
}
