import { Patient, Doctor, User, Sequelize } from '@/models/index'

/**
 * Get patients by doctor ID
 */
export const findByDoctorId = async (doctorId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit
  const statusOrder = `
    CASE
      WHEN current_health_status = 'critical' THEN 1
      WHEN current_health_status = 'monitoring' THEN 2
      WHEN current_health_status = 'stable' THEN 3
      ELSE 4
    END
  `

  const { rows, count } = await Patient.findAndCountAll({
    where: {},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'avatar', 'phoneNumber']
      },
      {
        model: Doctor,
        as: 'doctors',
        where: { user_id: doctorId },
        attributes: []
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    subQuery: false, // To fix incorrect LIMIT with include
    distinct: true, // To get correct count when using include
    col: 'user_id', // To ensure correct counting
    order: [
      [Sequelize.literal(statusOrder), 'ASC'],
      ['last_alert_at', 'DESC']
    ]
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
 * Get patient by user ID
 */
export const findByUserId = async (userId) => {
  return await Patient.findOne({
    where: { user_id: userId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'phoneNumber', 'role', 'avatar']
      }
    ]
  })
}
