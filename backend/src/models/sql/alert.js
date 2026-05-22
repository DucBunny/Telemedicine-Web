'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate(models) {
      // Cảnh báo thuộc về 1 bệnh nhân cụ thể
      Alert.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        targetKey: 'userId',
        as: 'patient',
      })

      // Cảnh báo có thể liên quan đến 1 thiết bị y tế
      Alert.belongsTo(models.Device, {
        foreignKey: 'deviceId',
        as: 'device',
      })

      // Cảnh báo có nhiều người nhận (bác sĩ)
      Alert.belongsToMany(models.Doctor, {
        through: models.AlertRecipient,
        foreignKey: 'alertId',
        otherKey: 'doctorId',
        as: 'alertRecipients',
      })

      // Cảnh báo có thể liên quan đến 1 bác sĩ
      Alert.belongsTo(models.Doctor, {
        foreignKey: 'handledBy',
        targetKey: 'userId',
        as: 'handledByDoctor',
      })

      // Cảnh báo có thể liên quan đến 1 hồ sơ bệnh án
      Alert.hasOne(models.MedicalRecord, {
        foreignKey: 'alertId',
        as: 'medicalRecord',
      })
    }
  }

  Alert.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      }, // VD: "bpm"
      value: {
        type: DataTypes.FLOAT,
      }, // VD: "150"
      message: {
        type: DataTypes.STRING,
      },
      triggerTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastDetectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      anomalyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM('pending', 'handling', 'resolved'),
        defaultValue: 'pending',
      },
      handledBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'alerts',
      modelName: 'Alert',
    },
  )

  return Alert
}
