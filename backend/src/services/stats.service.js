import * as statsRepo from '@/repositories/stats.repo'

export const getSystemStats = async () => {
  return await statsRepo.getSystemStats()
}

export const getDoctorStats = async (doctorId) => {
  return await statsRepo.getDoctorStats(doctorId)
}
