'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class DoctorWorkingHours extends Model {
    static associate(models) {
      DoctorWorkingHours.belongsTo(models.Doctor, {
        foreignKey: 'doctorId',
        targetKey: 'userId',
        as: 'doctor'
      })
    }
  }

  DoctorWorkingHours.init(
    {
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dayOfWeek: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7'
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'DoctorWorkingHours'
    }
  )

  return DoctorWorkingHours
}
