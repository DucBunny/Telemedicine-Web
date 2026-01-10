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

      // Cảnh báo có thể liên quan đến 1 dự đoán sức khỏe
      Alert.belongsTo(models.HealthPrediction, {
        foreignKey: 'predictionId',
        as: 'healthPrediction'
      })

      // Cảnh báo có thể được xác nhận bởi 1 bác sĩ
      Alert.belongsTo(models.Doctor, {
        foreignKey: 'acknowledgedBy',
        as: 'acknowledgingDoctor'
      })
    }
  }

  Alert.init(
    {
      patientId: DataTypes.INTEGER,
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
      acknowledgedBy: DataTypes.INTEGER,
      acknowledgedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Alert'
    }
  )

  return Alert
}
