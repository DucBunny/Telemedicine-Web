import { Op } from 'sequelize'
import { Doctor, Specialty, User } from '@/models/sql/index'
import { caseInsensitiveSearch } from '@/utils/search-case-insensitive'

/**
 * Get doctor by user ID
 */
export const findByUserId = async (userId, options = {}) => {
  return await Doctor.findByPk(userId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'phoneNumber', 'role', 'avatar'],
      },
      {
        model: Specialty,
        as: 'specialty',
        attributes: ['name'],
      },
    ],
    ...options,
  })
}

/**
 * Get all doctors with pagination, optional search and filter
 */
export const getAll = async ({
  page = 1,
  limit = 10,
  search = '',
  specialtyId = null,
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
      caseInsensitiveSearch('address', searchKeyword),
    ]
  }

  const { rows, count } = await Doctor.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'avatar'],
        required: Boolean(searchKeyword),
      },
      {
        model: Specialty,
        as: 'specialty',
        attributes: ['name'],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['experienceYears', 'DESC']],
    subQuery: false,
    distinct: true,
    col: 'user_id',
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
 * Update doctor
 */
export const update = async (userId, data, options = {}) => {
  const [updated] = await Doctor.update(data, {
    where: { userId },
    ...options,
  })
  return updated > 0 ? await findByUserId(userId, options) : null
}

/**
 * Lấy email bác sĩ theo user_id
 */
export const findDoctorEmailsByUserIds = async (doctorUserIds) => {
  if (!doctorUserIds?.length) return []
  const rows = await Doctor.findAll({
    where: { userId: { [Op.in]: doctorUserIds } },
    attributes: ['userId'],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['email', 'fullName'],
      },
    ],
  })
  return rows.map((d) => ({
    doctorId: d.userId,
    email: d.user?.email,
    fullName: d.user?.fullName,
  }))
}
