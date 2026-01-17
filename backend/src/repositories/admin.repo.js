import { User, Doctor, Patient, Device } from '@/models/sql/index'
import { Op } from 'sequelize'

/**
 * Get all users with pagination (Admin view)
 */
export const getAllUsers = async ({
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
 * Get system statistics
 */
export const getSystemStats = async () => {
  const totalUsers = await User.count()
  const totalDoctors = await Doctor.count()
  const totalPatients = await Patient.count()
  const totalDevices = await Device.count()

  const devicesOnline = await Device.count({
    where: { status: 'online' }
  })

  const devicesMaintenance = await Device.count({
    where: { status: 'maintenance' }
  })

  return {
    totalUsers,
    totalDoctors,
    totalPatients,
    totalDevices,
    devicesOnline,
    devicesMaintenance
  }
}

/**
 * Get recent users
 */
export const getRecentUsers = async (limit = 5) => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
    limit,
    order: [['createdAt', 'DESC']]
  })
}

/**
 * Get user by ID (admin access)
 */
export const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  })
}

/**
 * Update user status
 */
export const updateUserStatus = async (id, status) => {
  const user = await User.findByPk(id)
  if (!user) return null

  // Assuming there's a status field in User model
  return await user.update({ status })
}

/**
 * Delete user (admin only)
 */
export const deleteUserById = async (id) => {
  return await User.destroy({ where: { id } })
}
