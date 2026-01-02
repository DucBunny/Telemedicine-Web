import { StatusCodes } from 'http-status-codes'
import * as authService from '@/services/auth.service'
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie
} from '@/utils/cookie-helper'
import ApiError from '@/utils/api-error'

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const deviceInfo = req.headers['user-agent'] || req.body.deviceInfo || null
    const result = await authService.login({ ...req.body, deviceInfo })

    setRefreshTokenCookie(res, result.refreshToken)

    // Không trả về refreshToken
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    })
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const deviceInfo = req.headers['user-agent'] || req.body.deviceInfo || null
    const refreshToken = getRefreshTokenFromCookie(req)

    if (!refreshToken)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Refresh token not found',
        'REFRESH_TOKEN_NOT_FOUND'
      )

    const result = await authService.refreshToken({
      requestToken: refreshToken,
      deviceInfo: deviceInfo
    })

    // Set refresh token mới trong httpOnly cookie
    setRefreshTokenCookie(res, result.refreshToken)

    // Không trả refreshToken
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const deviceInfo = req.headers['user-agent'] || req.body.deviceInfo || null
    const refreshToken = getRefreshTokenFromCookie(req)

    await authService.logout({
      refreshToken,
      deviceInfo: deviceInfo
    })

    clearRefreshTokenCookie(res)

    res.status(StatusCodes.OK).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}
