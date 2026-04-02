'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      // Hồ sơ thuộc về 1 ca khám
      MedicalRecord.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId',
        as: 'appointment'
      })

      // Hồ sơ thuộc về bệnh nhân
      MedicalRecord.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        targetKey: 'userId',
        as: 'patient'
      })

      // Hồ sơ được tạo bởi bác sĩ
      MedicalRecord.belongsTo(models.Doctor, {
        foreignKey: 'doctorId',
        targetKey: 'userId',
        as: 'doctor'
      })

      // Hồ sơ có thể có nhiều tệp đính kèm
      MedicalRecord.hasMany(models.MedicalAttachment, {
        foreignKey: 'medicalRecordId',
        as: 'medicalAttachments'
      })
    }
  }

  MedicalRecord.init(
    {
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      symptoms: DataTypes.TEXT,
      diagnosis: DataTypes.TEXT,
      treatmentPlan: DataTypes.TEXT,
      prescription: DataTypes.JSON,
      notes: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'MedicalRecord'
    }
  )

  return MedicalRecord
}
