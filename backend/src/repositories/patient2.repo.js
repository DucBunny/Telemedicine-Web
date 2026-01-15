import { User, Patient, Device } from '@/models/index'
import { Op } from 'sequelize'

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
 * Get patient by ID
 */
export const findById = async (id) => {
  return await Patient.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ['id', 'fullName', 'email', 'phoneNumber', 'role']
      },
      {
        model: Device,
        attributes: ['id', 'deviceName', 'deviceType', 'status']
      }
    ]
  })
}

/**
 * Get patient by user ID
 */
export const findByUserId = async (userId) => {
  return await Patient.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ['id', 'fullName', 'email', 'phoneNumber', 'role']
      },
      {
        model: Device,
        attributes: ['id', 'deviceName', 'deviceType', 'status']
      }
    ]
  })
}

/**
 * Create new patient
 */
export const create = async (data) => {
  return await Patient.create(data)
}

/**
 * Update patient
 */
export const update = async (id, data) => {
  const patient = await Patient.findByPk(id)
  if (!patient) return null

  return await patient.update(data)
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
export const getPatientDevices = async (patientId) => {
  return await Device.findAll({
    where: { patientId }
  })
}
