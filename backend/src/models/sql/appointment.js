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
      actualEndedAt: DataTypes.DATE,
      durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 30
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      type: {
        type: DataTypes.ENUM('online', 'offline'),
        defaultValue: 'online'
      },
      meetingLink: DataTypes.STRING,
      reason: DataTypes.TEXT,
      cancelReason: DataTypes.TEXT
    },
    {
      sequelize,
      tableName: 'appointments',
      modelName: 'Appointment'
    }
  )

  return Appointment
}
