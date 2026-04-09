import { Specialty } from '@/models/sql/index'
import ApiError from '@/utils/api-error'
import { StatusCodes } from 'http-status-codes'

/**
 * Get all specialties
 */
export const getAllSpecialties = async () => {
  return await Specialty.findAll({
    order: [['name', 'ASC']]
  })
}

/**
 * Get specialty by ID
 */
export const getSpecialtyById = async (specialtyId) => {
  const specialty = await Specialty.findByPk(specialtyId)
  if (!specialty)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Specialty not found',
      'SPECIALTY_NOT_FOUND'
    )

  return specialty
}
