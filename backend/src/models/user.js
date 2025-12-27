'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 1. User (Bệnh nhân) có 1 hồ sơ chi tiết
      User.hasOne(models.PatientDetail, {
        foreignKey: 'userId',
        as: 'patientProfile'
      })

      // 2. User (Bác sĩ) quản lý nhiều hồ sơ bệnh nhân
      User.hasMany(models.PatientDetail, {
        foreignKey: 'doctorId',
        as: 'managedPatients'
      })

      // 3. User (Bệnh nhân) sở hữu 1 thiết bị
      User.hasOne(models.Device, {
        foreignKey: 'assignedToUserId',
        as: 'device'
      })

      // 4. User (Bệnh nhân) có nhiều cảnh báo
      User.hasMany(models.Alert, {
        foreignKey: 'patientId',
        as: 'alerts'
      })

      // 5. User (Bệnh nhân) có lịch sử khám bệnh
      User.hasMany(models.MedicalRecord, {
        foreignKey: 'patientId',
        as: 'medicalHistory'
      })

      // 6. User (Bác sĩ) có lịch sử đã khám cho ai
      User.hasMany(models.MedicalRecord, {
        foreignKey: 'doctorId',
        as: 'doctorRecords'
      })

      // 7. Quan hệ với Appointment
      User.hasMany(models.Appointment, {
        foreignKey: 'patientId',
        as: 'patientAppointments'
      })
      User.hasMany(models.Appointment, {
        foreignKey: 'doctorId',
        as: 'doctorAppointments'
      })

      // 8. Quan hệ với Chat (Tin nhắn gửi đi & nhận về)
      User.hasMany(models.ChatMessage, {
        foreignKey: 'senderId',
        as: 'sentMessages'
      })
      User.hasMany(models.ChatMessage, {
        foreignKey: 'receiverId',
        as: 'receivedMessages'
      })

      // 9. Quan hệ với CallLog
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
      phoneNumber: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users'
    }
  )

  return User
}
