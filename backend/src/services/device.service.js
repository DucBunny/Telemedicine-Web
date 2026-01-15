import * as deviceRepo from '@/repositories/device.repo'

export const getAllDevices = async ({ page, limit, status }) => {
  return await deviceRepo.getAll({ page, limit, status })
}
