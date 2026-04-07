'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // 1-1 với User (Tài khoản bệnh nhân)
      Patient.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })

      // N-N với Doctor (Bác sĩ phụ trách)
      Patient.belongsToMany(models.Doctor, {
        through: models.PatientDoctor,
        foreignKey: 'patientId',
        otherKey: 'doctorId',
        as: 'doctors'
      })

      // 1-N với Device (Bệnh nhân có thể có nhiều thiết bị)
      Patient.hasMany(models.Device, {
        foreignKey: 'assignedTo',
        sourceKey: 'userId',
        as: 'devices'
      })

      // 1-N với Alert (Cảnh báo của bệnh nhân)
      Patient.hasMany(models.Alert, {
        foreignKey: 'patientId',
        sourceKey: 'userId',
        as: 'alerts'
      })

      // 1-N với HealthPrediction (Dự đoán sức khỏe của bệnh nhân)
      Patient.hasMany(models.HealthPrediction, {
        foreignKey: 'patientId',
        sourceKey: 'userId',
        as: 'healthPredictions'
      })

      // 1-N với MedicalRecord (Hồ sơ bệnh án của bệnh nhân)
      Patient.hasMany(models.MedicalRecord, {
        foreignKey: 'patientId',
        sourceKey: 'userId',
        as: 'medicalRecords'
      })

      // 1-N với Appointment (Lịch hẹn của bệnh nhân)
      Patient.hasMany(models.Appointment, {
        foreignKey: 'patientId',
        sourceKey: 'userId',
        as: 'appointments'
      })
    }
  }

  Patient.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other')
      },
      bloodType: {
        type: DataTypes.STRING
      },
      height: {
        type: DataTypes.FLOAT
      },
      weight: {
        type: DataTypes.FLOAT
      },
      medicalHistory: {
        type: DataTypes.TEXT
      },
      address: {
        type: DataTypes.STRING
      },
      currentHealthStatus: {
        type: DataTypes.ENUM('stable', 'monitoring', 'critical'),
        defaultValue: 'stable'
      },
      currentIssue: {
        type: DataTypes.TEXT
      },
      lastAlertAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'patients',
      modelName: 'Patient'
    }
  )

  return Patient
}
