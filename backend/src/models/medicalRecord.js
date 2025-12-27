'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      // Hồ sơ thuộc về bệnh nhân
      MedicalRecord.belongsTo(models.User, {
        foreignKey: 'patientId',
        as: 'patient'
      })

      // Hồ sơ được tạo bởi bác sĩ
      MedicalRecord.belongsTo(models.User, {
        foreignKey: 'doctorId',
        as: 'doctor'
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
