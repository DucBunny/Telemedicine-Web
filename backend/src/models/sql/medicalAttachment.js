'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MedicalAttachment extends Model {
    static associate(models) {
      // Tệp đính kèm thuộc về 1 Hồ sơ y tế
      MedicalAttachment.belongsTo(models.MedicalRecord, {
        foreignKey: 'medicalRecordId',
        as: 'medicalRecord',
      })

      // Tệp đính kèm thuộc về 1 Cảnh báo
      MedicalAttachment.belongsTo(models.Alert, {
        foreignKey: 'alertId',
        as: 'alert',
      })
    }
  }

  MedicalAttachment.init(
    {
      medicalRecordId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      alertId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      fileName: {
        type: DataTypes.STRING,
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileType: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.ENUM('auto_ecg_report', 'other'), // Hiện tại chỉ có 2 loại: auto_ecg_report và other để phân biệt tệp đính kèm là từ báo cáo AutoECG hay từ người dùng upload, có thể phát triển trong tương lai
        defaultValue: 'other',
      },
    },
    {
      sequelize,
      tableName: 'medical_attachments',
      modelName: 'MedicalAttachment',
      createdAt: 'uploadedAt',
      updatedAt: false,
    },
  )

  return MedicalAttachment
}
