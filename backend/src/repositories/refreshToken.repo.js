import { RefreshToken } from '@/models/sql/index'

/**
 * Create refresh token
 */
export const create = async (data) => {
  return await RefreshToken.create(data)
}

/**
 * Find refresh token by token string
 */
export const findByToken = async (token) => {
  return await RefreshToken.findOne({ where: { token } })
}

/**
 * Revoke refresh token (mark as revoked)
 */
export const revoke = async (token) => {
  return await RefreshToken.update({ isRevoked: true }, { where: { token } })
}

/**
 * Revoke all refresh tokens for an user
 */
export const revokeAllUserTokens = async (userId) => {
  return await RefreshToken.update({ isRevoked: true }, { where: { userId } })
}

/**
 * Delete refresh token by ID
 */
export const deleteRefreshToken = async (id) => {
  return await RefreshToken.destroy({ where: { id } })
}
