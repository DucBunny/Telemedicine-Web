import { User } from '@/models/index'

export const create = async (data) => {
  return await User.create(data)
}

export const findById = async (id) => {
  return await User.findByPk(id)
}

export const findByEmail = async (email) => {
  return await User.findOne({ where: { email } })
}

export const findByPhoneNumber = async (phoneNumber) => {
  return await User.findOne({ where: { phoneNumber } })
}

export const getAll = async () => {
  return await User.findAll()
}

export const update = async (id, data) => {
  return await User.update(data, { where: { id } })
}

export const deleteUser = async (id) => {
  return await User.destroy({ where: { id } })
}

export const updatePassword = async (userId, newHashedPassword) => {
  return await User.update(
    { password: newHashedPassword },
    { where: { id: userId } }
  )
}
