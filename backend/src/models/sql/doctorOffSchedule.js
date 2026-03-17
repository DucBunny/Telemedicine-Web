'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class DoctorOffSchedule extends Model {
    static associate(models) {
      DoctorOffSchedule.belongsTo(models.Doctor, {
        foreignKey: 'doctorId',
        targetKey: 'userId',
        as: 'doctor'
      })
    }
  }

  DoctorOffSchedule.init(
    {
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      offDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: 'NULL nếu nghỉ cả ngày'
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: 'NULL nếu nghỉ cả ngày'
      },
      reason: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'DoctorOffSchedule'
    }
  )

  return DoctorOffSchedule
}
