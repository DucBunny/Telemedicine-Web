import { User } from '@/models/index'
import { Op } from 'sequelize'

export const create = async (data) => {
  return await User.create(data)
}

export const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  })
}

export const findByEmail = async (email) => {
  return await User.findOne({ where: { email } })
}

export const findByPhoneNumber = async (phoneNumber) => {
  return await User.findOne({ where: { phoneNumber } })
}

export const updatePassword = async (userId, newHashedPassword) => {
  return await User.update(
    { password: newHashedPassword },
    { where: { id: userId } }
  )
}

export const getAll = async ({
  page = 1,
  limit = 10,
  search = '',
  role = ''
}) => {
  const offset = (page - 1) * limit
  const whereClause = {}

  if (search) {
    whereClause[Op.or] = [
      { fullName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } }
    ]
  }

  if (role) {
    whereClause.role = role
  }

  const { rows, count } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ['password'] },
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

export const updateStatus = async (userId, status) => {
  return await User.update({ status }, { where: { id: userId } })
}

export const deleteById = async (id) => {
  return await User.destroy({ where: { id } })
}
