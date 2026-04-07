'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class DoctorOffSchedule extends Model {
    static associate(models) {
      // N-1 với Doctor (1 bác sĩ có thể có nhiều lịch nghỉ)
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
      reason: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      tableName: 'doctor_off_schedules',
      modelName: 'DoctorOffSchedule'
    }
  )

  return DoctorOffSchedule
}
