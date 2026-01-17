import { Device } from '@/models/sql/index'

/**
 * Get all devices
 */
export const getAll = async ({ page = 1, limit = 10, status = '' }) => {
  const offset = (page - 1) * limit
  const whereClause = {}

  if (status) {
    whereClause.status = status
  }

  const { rows, count } = await Device.findAndCountAll({
    where: whereClause,
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
 * Find device by ID
 */
export const findById = async (id) => {
  return await Device.findByPk(id)
}
