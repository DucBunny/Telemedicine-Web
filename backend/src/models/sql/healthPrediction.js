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
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      predictedStatus: {
        type: DataTypes.ENUM('normal', 'warning', 'critical')
      },
      confidence: {
        type: DataTypes.FLOAT
      },
      modelVersion: {
        type: DataTypes.STRING
      },
      inputWindow: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      tableName: 'health_predictions',
      modelName: 'HealthPrediction',
      updatedAt: false
    }
  )

  return HealthPrediction
}
