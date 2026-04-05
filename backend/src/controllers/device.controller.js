import * as deviceService from '@/services/device.service'
import { StatusCodes } from 'http-status-codes'

export const createDevice = async (req, res, next) => {
  try {
    const device = await deviceService.createDevice(req.body)
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: device
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all devices with pagination and optional status filter
 */
export const getAllDevices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query
    const result = await deviceService.getAllDevices({ page, limit, status })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}
