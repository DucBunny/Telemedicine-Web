import { Patient, Doctor, User, Sequelize, Device } from '@/models/sql/index'
import { Op } from 'sequelize'

/**
 * Get doctor's patients by doctor ID
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
      ['last_alert_at', 'DESC'],
      ['user_id', 'ASC']
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
export const findByUserId = async (userId, options = {}) => {
  return await Patient.findByPk(userId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'phoneNumber', 'role', 'avatar']
      }
    ],
    ...options
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
    ...options
  })
  return updated > 0 ? await findByUserId(userId, options) : null
}

//------------------------------------------------------------

/**
 * Get all patients with pagination
 */
export const getAll = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit
  const whereClause = {}

  if (search) {
    whereClause[Op.or] = [
      { '$User.fullName$': { [Op.like]: `%${search}%` } },
      { '$User.email$': { [Op.like]: `%${search}%` } },
      { bloodType: { [Op.like]: `%${search}%` } }
    ]
  }

  const { rows, count } = await Patient.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
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
 * Delete patient
 */
export const deletePatient = async (id) => {
  return await Patient.destroy({ where: { id } })
}

/**
 * Get patient's devices
 */
export const getPatientDevices = async (userId) => {
  return await Device.findAll({
    where: { assignedTo: userId }
  })
}
