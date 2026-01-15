'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      // 1-1 với User (Tài khoản bác sĩ)
      Doctor.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })

      // N-N với Patient (Bác sĩ phụ trách nhiều bệnh nhân)
      Doctor.belongsToMany(models.Patient, {
        through: models.PatientDoctor,
        foreignKey: 'doctorId',
        otherKey: 'patientId',
        as: 'patients'
      })

      // 1-N với Appointment (Lịch hẹn của bác sĩ)
      Doctor.hasMany(models.Appointment, {
        foreignKey: 'doctorId',
        as: 'appointments'
      })

      // 1-N với MedicalRecord (Các hồ sơ bệnh án do bác sĩ này tạo)
      Doctor.hasMany(models.MedicalRecord, {
        foreignKey: 'doctorId',
        as: 'medicalRecords'
      })

      // N-N với Alert (Cảnh báo được gửi đến bác sĩ)
      Doctor.belongsToMany(models.Alert, {
        through: models.AlertRecipient,
        foreignKey: 'doctorId',
        otherKey: 'alertId',
        as: 'alertRecipients'
      })
    }
  }

  Doctor.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      specialization: DataTypes.STRING,
      degree: DataTypes.STRING,
      experienceYears: DataTypes.INTEGER,
      bio: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Doctor'
    }
  )

  return Doctor
}
