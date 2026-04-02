import {
  Doctor,
  Patient,
  User,
  MedicalRecord,
  Specialty,
  Appointment,
  MedicalAttachment,
  Sequelize
} from '@/models/sql/index'
import { Op } from 'sequelize'

/**
 * Generic function to find medical records by owner (doctor or patient)
 */
const findByOwner = async ({
  where,
  include,
  attributes,
  page = 1,
  limit = 10
}) => {
  const offset = (page - 1) * limit

  const includeOptions = [
    ...include,
    {
      model: Appointment,
      as: 'appointment',
      attributes: ['id', 'scheduledAt']
    }
  ]

  const { rows, count } = await MedicalRecord.findAndCountAll({
    where,
    include: includeOptions,
    attributes,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['appointment', 'scheduledAt', 'DESC']],
    subQuery: false,
    distinct: true,
    col: 'id'
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
 * Find medical records by doctor ID
 */
export const findByDoctorId = async (doctorId, { page = 1, limit = 10 }) => {
  return await findByOwner({
    where: { doctorId },
    include: [
      {
        model: Patient,
        as: 'patient',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'avatar']
          }
        ]
      }
    ],
    page,
    limit
  })
}

/**
 * Find medical records by patient ID
 */
export const findByPatientId = async (
  patientId,
  { page = 1, limit = 10, search = '' }
) => {
  const searchKeyword = search?.trim().toLowerCase()

  return await findByOwner({
    where: {
      patientId,
      ...(searchKeyword && {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('doctor.user.full_name')),
            'LIKE',
            `%${searchKeyword}%`
          ),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('diagnosis')),
            'LIKE',
            `%${searchKeyword}%`
          ),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('doctor.specialty.name')),
            'LIKE',
            `%${searchKeyword}%`
          )
        ]
      })
    },
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'avatar']
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: ['name']
          }
        ],
        attributes: ['degree']
      }
    ],
    attributes: ['id', 'diagnosis', 'symptoms'],
    page,
    limit
  })
}

/**
 * Find medical record by ID
 */
export const findById = async (id) => {
  return await MedicalRecord.findByPk(id, {
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'avatar']
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: ['name']
          }
        ]
      },
      {
        model: Appointment,
        as: 'appointment',
        attributes: ['id', 'scheduledAt']
      },
      {
        model: MedicalAttachment,
        as: 'medicalAttachments'
      }
    ]
  })
}

//------------------------------------------------------------

/**
 * Create medical record
 */
export const create = async (data) => {
  return await MedicalRecord.create(data)
}

/**
 * Update medical record
 */
export const update = async (id, data) => {
  const record = await MedicalRecord.findByPk(id)
  if (!record) return null
  return await record.update(data)
}

/**
 * Delete medical record
 */
export const deleteRecord = async (id) => {
  const record = await MedicalRecord.findByPk(id)
  if (!record) return null
  await record.destroy()
  return true
}
