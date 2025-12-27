'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate(models) {
      // Cảnh báo thuộc về 1 bệnh nhân cụ thể
      Alert.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' })
    }
  }

  Alert.init(
    {
      patientId: DataTypes.INTEGER,
      type: DataTypes.STRING, // VD: "HIGH_BPM"
      value: DataTypes.STRING, // VD: "150"
      message: DataTypes.STRING,
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'critical'),
        defaultValue: 'medium'
      },
      isResolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Alert'
    }
  )

  return Alert
}
