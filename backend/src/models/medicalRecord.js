'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
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
        as: 'attachments'
      })
    }
  }

  MedicalRecord.init(
    {
      patientId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      diagnosis: DataTypes.TEXT,
      prescription: DataTypes.TEXT,
      notes: DataTypes.TEXT,
      visitDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'MedicalRecord'
    }
  )

  return MedicalRecord
}
