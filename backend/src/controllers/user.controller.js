import * as userService from '@/services/user.service'
import { StatusCodes } from 'http-status-codes'

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query
    const result = await userService.getAllUsers({ page, limit, search, role })

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await userService.getUserById(id)
    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const user = await userService.updateUserStatus(id, status)

    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await userService.deleteUser(id)

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
