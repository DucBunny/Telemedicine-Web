'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate(models) {
      // Cảnh báo thuộc về 1 bệnh nhân cụ thể
      Alert.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        targetKey: 'userId',
        as: 'patient'
      })

      // Cảnh báo có thể liên quan đến 1 thiết bị y tế
      Alert.belongsTo(models.Device, {
        foreignKey: 'deviceId',
        as: 'device'
      })

      // Cảnh báo có thể liên quan đến 1 dự đoán sức khỏe
      Alert.belongsTo(models.HealthPrediction, {
        foreignKey: 'predictionId',
        as: 'healthPrediction'
      })

      // Cảnh báo có nhiều người nhận (bác sĩ)
      Alert.belongsToMany(models.Doctor, {
        through: models.AlertRecipient,
        foreignKey: 'alertId',
        otherKey: 'doctorId',
        as: 'alertRecipients'
      })
    }
  }

  Alert.init(
    {
      patientId: DataTypes.INTEGER,
      deviceId: DataTypes.INTEGER,
      predictionId: DataTypes.INTEGER,
      type: DataTypes.STRING, // VD: "bpm"
      value: DataTypes.FLOAT, // VD: "150"
      message: DataTypes.STRING,
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'critical'),
        defaultValue: 'medium'
      },
      source: DataTypes.STRING,
      isResolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      resolvedAt: DataTypes.DATE,
      resolvedBy: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Alert'
    }
  )

  return Alert
}
