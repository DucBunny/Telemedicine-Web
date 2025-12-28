'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // Lịch hẹn thuộc về 1 Bệnh nhân
      Appointment.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        targetKey: 'userId',
        as: 'patient'
      })

      // Lịch hẹn thuộc về 1 Bác sĩ
      Appointment.belongsTo(models.Doctor, {
        foreignKey: 'doctorId',
        targetKey: 'userId',
        as: 'doctor'
      })
    }
  }

  Appointment.init(
    {
      patientId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endAt: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      meetingLink: DataTypes.STRING,
      reason: DataTypes.TEXT,
      cancelReason: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Appointment'
    }
  )

  return Appointment
}
