import { Sequelize } from '@/models/sql/index'

/**
 * Helper function to create a case-insensitive search condition for Sequelize queries.
 * Usage: In your repository, you can use this function to build a where clause for searching by name or other text fields.
 * Example:
 * const whereClause = {
 *   ...caseInsensitiveSearch('full_name', searchTerm)
 * }
 */
export const caseInsensitiveSearch = (field, searchTerm) => {
  return Sequelize.where(
    Sequelize.fn('lower', Sequelize.col(field)),
    'LIKE',
    `%${searchTerm.trim().toLowerCase()}%`
  )
}
