'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MedicalAttachment extends Model {
    static associate(models) {
      // Tệp đính kèm thuộc về 1 Hồ sơ y tế
      MedicalAttachment.belongsTo(models.MedicalRecord, {
        foreignKey: 'medicalRecordId',
        as: 'medicalRecord'
      })
    }
  }

  MedicalAttachment.init(
    {
      medicalRecordId: DataTypes.INTEGER,
      fileUrl: DataTypes.STRING,
      fileType: DataTypes.STRING,
      uploadedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'MedicalAttachment',
      timestamps: false
    }
  )
  return MedicalAttachment
}
