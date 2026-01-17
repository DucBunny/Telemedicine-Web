import HealthMetric from '@/models/nosql/healthMetrics'

/**
 * Create new health metric
 */
export const create = async (data) => {
  return await HealthMetric.create(data)
}
