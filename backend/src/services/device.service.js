import * as deviceRepo from '@/repositories/device.repo'

/**
 * Creates a new device
 */
export const createDevice = async (data) => {
  return await deviceRepo.create(data)
}

export const getAllDevices = async ({ page, limit, status }) => {
  return await deviceRepo.getAll({ page, limit, status })
}
