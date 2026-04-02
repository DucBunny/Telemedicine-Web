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
      medicalRecordId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fileName: DataTypes.STRING,
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileType: DataTypes.STRING,
      uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'medical_attachments',
      modelName: 'MedicalAttachment',
      timestamps: false
    }
  )

  return MedicalAttachment
}
