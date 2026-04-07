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
      avatar: {
        type: DataTypes.STRING
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true
      },
      status: {
        type: DataTypes.ENUM('active', 'locked', 'pending'),
        defaultValue: 'pending'
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        defaultValue: null
      }
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      indexes: [
        {
          // Hỗ trợ tìm kiếm user theo email nhanh chóng, đồng thời đảm bảo email không bị trùng lặp
          unique: true,
          name: 'idx_users_email',
          fields: ['email']
        },
        {
          // Hỗ trợ lọc user theo số điện thoại nhanh chóng, đồng thời đảm bảo số điện thoại không bị trùng lặp
          unique: true,
          name: 'idx_users_phone_number',
          fields: ['phone_number']
        }
      ]
    }
  )

  return User
}
