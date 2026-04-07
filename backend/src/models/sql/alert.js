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
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      predictionId: {
        type: DataTypes.INTEGER
        // allowNull: false
      },
      type: {
        type: DataTypes.STRING
      }, // VD: "bpm"
      value: {
        type: DataTypes.FLOAT
      }, // VD: "150"
      message: {
        type: DataTypes.STRING
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'critical'),
        defaultValue: 'medium'
      },
      source: {
        type: DataTypes.STRING
      },
      isResolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      resolvedAt: {
        type: DataTypes.DATE
      },
      resolvedBy: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      tableName: 'alerts',
      modelName: 'Alert'
    }
  )

  return Alert
}
