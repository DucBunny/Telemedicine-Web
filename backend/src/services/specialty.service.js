import { Specialty } from '@/models/sql/index'
import ApiError from '@/utils/api-error'

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
export const getSpecialtyById = async (id) => {
  const specialty = await Specialty.findByPk(id)
  if (!specialty)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Specialty not found',
      'SPECIALTY_NOT_FOUND'
    )

  return specialty
}
