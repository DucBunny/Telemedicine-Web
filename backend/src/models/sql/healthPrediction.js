'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class HealthPrediction extends Model {
    static associate(models) {
      // Dự đoán thuộc về 1 Bệnh nhân
      HealthPrediction.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        targetKey: 'userId',
        as: 'patient'
      })

      // Dự đoán có thể liên quan đến 1 Cảnh báo
      HealthPrediction.hasOne(models.Alert, {
        foreignKey: 'predictionId',
        as: 'alert'
      })
    }
  }

  HealthPrediction.init(
    {
      patientId: DataTypes.INTEGER,
      predictedStatus: DataTypes.ENUM('normal', 'warning', 'critical'),
      confidence: DataTypes.FLOAT,
      modelVersion: DataTypes.STRING,
      inputWindow: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'HealthPrediction',
      updatedAt: false
    }
  )
  return HealthPrediction
}
