import { RefreshToken } from '@/models/index'

export const create = async (data) => {
  return await RefreshToken.create(data)
}

export const findByToken = async (token) => {
  return await RefreshToken.findOne({ where: { token } })
}

export const revoke = async (token) => {
  return await RefreshToken.update({ isRevoked: true }, { where: { token } })
}

export const revokeAllUserTokens = async (userId) => {
  return await RefreshToken.update({ isRevoked: true }, { where: { userId } })
}

export const deleteRefreshToken = async (id) => {
  return await RefreshToken.destroy({ where: { id } })
}
