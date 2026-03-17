import { Specialty } from '@/models/sql/index'

/**
 * Get all specialties
 */
export const getAllSpecialties = async () => {
  return await Specialty.findAll({
    order: [['name', 'ASC']]
  })
}
