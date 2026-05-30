import { Op } from 'sequelize'
import {
  Alert,
  AlertRecipient,
  Doctor,
  Patient,
  Sequelize,
  User,
} from '@/models/sql/index'
import { caseInsensitiveSearch } from '@/utils/search-case-insensitive'

const alertDetailInclude = [
  {
    model: Patient,
    as: 'patient',
    attributes: ['userId'],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'avatar'],
      },
    ],
  },
  {
    model: Doctor,
    as: 'handledByDoctor',
    attributes: ['userId'],
    required: false,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'avatar'],
      },
    ],
  },
]

/**
 * Tạo alert mới
 */
export const create = async (data, options = {}) => {
  return await Alert.create(data, options)
}

/**
 * Tạo người nhận cảnh báo cho danh sách bác sĩ
 */
export const createRecipients = async (alertId, doctorIds, options = {}) => {
  if (!doctorIds?.length) return []
  const rows = doctorIds.map((doctorId) => ({
    alertId,
    doctorId,
    isRead: false,
  }))
  return await AlertRecipient.bulkCreate(rows, options)
}

/**
 * Các alert pending của bệnh nhân (dùng khi telemetry về normal)
 */
export const findPendingByPatientId = async (patientId, options = {}) => {
  return await Alert.findAll({
    where: { patientId, status: 'pending' },
    attributes: ['id', 'type', 'patientId'],
    ...options,
  })
}

/**
 * Alert cùng loại đang mở (pending / handling)
 */
export const findOpenByPatientAndType = async (
  patientId,
  type,
  options = {},
) => {
  return await Alert.findOne({
    where: {
      patientId,
      type,
      status: { [Op.in]: ['pending', 'handling'] },
    },
    order: [['createdAt', 'DESC']],
    ...options,
  })
}

/**
 * Cập nhật khi phát hiện lại trong cửa sổ throttle (không insert mới)
 */
export const recordAnomalyDetection = async (
  alertId,
  detectedAt = new Date(),
  options = {},
) => {
  const [affectedCount] = await Alert.update(
    {
      lastDetectedAt: new Date(detectedAt),
      anomalyCount: Sequelize.literal('anomaly_count + 1'),
    },
    {
      where: {
        id: alertId,
        status: { [Op.in]: ['pending', 'handling'] },
      },
      ...options,
    },
  )
  return affectedCount > 0 ? await findById(alertId, options) : null
}

/**
 * Get doctor's alerts
 */
export const findByDoctorId = async (
  doctorId,
  { page = 1, limit = 10, search, status, handledBy, createdFrom, createdTo },
) => {
  const offset = (page - 1) * limit
  const statusOrder = `
    CASE
      WHEN status = 'pending' THEN 1
      WHEN status = 'handling' THEN 2
      WHEN status = 'resolved' THEN 3
      ELSE 4
    END
  `

  const whereClause = {}

  if (search?.trim().toLowerCase()) {
    whereClause[Op.or] = [
      caseInsensitiveSearch('patient.user.full_name', search),
    ]
  }

  if (status) {
    whereClause.status = status
  }

  if (handledBy) {
    whereClause.handledBy = handledBy
  }

  if (createdFrom || createdTo) {
    whereClause.createdAt = {}
    if (createdFrom) whereClause.createdAt[Op.gte] = new Date(createdFrom)
    if (createdTo) whereClause.createdAt[Op.lte] = new Date(createdTo)
  }

  const { rows, count } = await Alert.findAndCountAll({
    where: whereClause,
    include: [
      ...alertDetailInclude,
      {
        model: Doctor,
        as: 'alertRecipients',
        attributes: [],
        where: { userId: doctorId },
        required: true, // Inner join to filter alerts by doctor
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    subQuery: false, // To fix incorrect LIMIT with include
    distinct: true, // To get correct count when using include
    order: [
      [Sequelize.literal(statusOrder), 'ASC'],
      ['createdAt', 'DESC'],
    ],
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
 * Patient health history (alerts for current patient)
 */
export const findByPatientId = async (patientId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit

  const { rows, count } = await Alert.findAndCountAll({
    where: { patientId },
    attributes: ['id', 'type', 'value', 'status', 'createdAt', 'resolvedAt'],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
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
 * Find alert by ID with relations
 */
export const findById = async (alertId, options = {}) => {
  return await Alert.findByPk(alertId, {
    include: alertDetailInclude,
    ...options,
  })
}

/**
 * Check if doctor is a recipient of the alert
 */
export const isDoctorRecipient = async (alertId, doctorId) => {
  const row = await AlertRecipient.findOne({
    where: { alertId, doctorId },
  })
  return !!row
}

/**
 * Get doctor user IDs who receive this alert
 * @returns {number[]} doctorIds
 * @example
 * const doctorIds = await findRecipientDoctorIds(alertId) => [1, 2, 3]
 */
export const findRecipientDoctorIds = async (alertId) => {
  return await AlertRecipient.findAll({
    where: { alertId },
    attributes: ['doctorId'],
  })
}

/**
 * Mark alert as read for a doctor recipient
 */
export const markRecipientAsRead = async (alertId, doctorId) => {
  const [affectedCount] = await AlertRecipient.update(
    { isRead: true, readAt: new Date() },
    { where: { alertId, doctorId, isRead: false } },
  )
  return affectedCount > 0 ? await findById(alertId) : null
}

/**
 * Claim alert handling (pending -> handling)
 */
export const claimHandling = async (alertId, doctorId) => {
  const [affectedCount] = await Alert.update(
    {
      status: 'handling',
      handledBy: doctorId,
    },
    {
      where: {
        id: alertId,
        status: 'pending',
      },
    },
  )

  return affectedCount > 0 ? await findById(alertId) : null
}

/**
 * Find alert being handled by a specific doctor
 */
export const findHandlingByDoctor = async (alertId, doctorId, options = {}) => {
  return await Alert.findOne({
    where: {
      id: alertId,
      handledBy: doctorId,
      status: 'handling',
    },
    ...options,
  })
}

/**
 * Release handling (handling -> pending) when call ends without resolve
 */
export const releaseHandling = async (alertId, doctorId) => {
  const [affectedCount] = await Alert.update(
    { status: 'pending', handledBy: null },
    {
      where: {
        id: alertId,
        handledBy: doctorId,
        status: 'handling',
      },
    },
  )
  return affectedCount > 0 ? await findById(alertId) : null
}

/**
 * Resolve alert (handling -> resolved)
 */
export const resolve = async (alertId, options = {}) => {
  const [affectedCount] = await Alert.update(
    {
      status: 'resolved',
      resolvedAt: new Date(),
    },
    {
      where: {
        id: alertId,
        status: 'handling',
      },
      ...options,
    },
  )
  return affectedCount > 0 ? await findById(alertId, options) : null
}

/**
 * Find unresolved alerts that have been stale since the provided cutoff
 */
export const findStaleOpenAlerts = async (cutoffDate, options = {}) => {
  return await Alert.findAll({
    where: {
      status: { [Op.in]: ['pending', 'handling'] },
      lastDetectedAt: {
        [Op.lte]: new Date(cutoffDate),
      },
    },
    order: [['lastDetectedAt', 'ASC']],
    ...options,
  })
}

/**
 * Resolve alert by system bot without requiring manual handling first
 */
export const resolveByBot = async (
  alertId,
  botDoctorId,
  resolvedAt = new Date(),
  options = {},
) => {
  const [affectedCount] = await Alert.update(
    {
      status: 'resolved',
      handledBy: botDoctorId,
      resolvedAt,
    },
    {
      where: {
        id: alertId,
        status: { [Op.in]: ['pending', 'handling'] },
      },
      ...options,
    },
  )

  return affectedCount > 0 ? await findById(alertId, options) : null
}
