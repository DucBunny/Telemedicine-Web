'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User (Bệnh nhân) có 1 hồ sơ chi tiết
      User.hasOne(models.Patient, {
        foreignKey: 'userId',
        as: 'patient'
      })

      // User (Bác sĩ) có 1 hồ sơ chi tiết
      User.hasOne(models.Doctor, {
        foreignKey: 'userId',
        as: 'doctor'
      })

      // User có nhiều RefreshToken
      User.hasMany(models.RefreshToken, {
        foreignKey: 'userId',
        as: 'refreshTokens'
      })

      // Quan hệ với Chat (Tin nhắn gửi đi & nhận về)
      User.hasMany(models.ChatMessage, {
        foreignKey: 'senderId',
        as: 'sentMessages'
      })
      User.hasMany(models.ChatMessage, {
        foreignKey: 'receiverId',
        as: 'receivedMessages'
      })

      // Quan hệ với CallLog
      User.hasMany(models.CallLog, {
        foreignKey: 'callerId',
        as: 'madeCalls'
      })
      User.hasMany(models.CallLog, {
        foreignKey: 'receiverId',
        as: 'receivedCalls'
      })
    }
  }

  User.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'doctor', 'patient'),
        defaultValue: 'patient'
      },
      avatar: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('active', 'locked'),
        defaultValue: 'active'
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )

  return User
}
