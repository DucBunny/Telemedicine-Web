'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class DoctorWorkingHours extends Model {
    static associate(models) {
      // N-1 với Doctor (1 bác sĩ có nhiều khung giờ làm việc)
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
      tableName: 'doctor_working_hours',
      modelName: 'DoctorWorkingHours'
    }
  )

  return DoctorWorkingHours
}
