'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PatientDoctor extends Model {
    static associate(models) {}
  }

  PatientDoctor.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      doctorId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      role: DataTypes.STRING,
      assignedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'PatientDoctor',
      timestamps: false
    }
  )
  return PatientDoctor
}
