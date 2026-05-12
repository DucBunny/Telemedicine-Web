import * as statsRepo from '@/repositories/stats.repo'

/**
 * Get overall system statistics for admin dashboard
 */
export const getSystemStats = async () => {
  return await statsRepo.getSystemStats()
}

/**
 * Get statistics for a specific doctor for doctor dashboard
 */
export const getDoctorStats = async (doctorId) => {
  return await statsRepo.getDoctorStats(doctorId)
}
