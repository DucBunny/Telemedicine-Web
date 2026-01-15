'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class AlertRecipient extends Model {
    static associate(models) {}
  }

  AlertRecipient.init(
    {
      alertId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      isAcknowledged: { type: DataTypes.BOOLEAN, defaultValue: false },
      deliveredAt: { type: DataTypes.DATE, allowNull: false },
      readAt: DataTypes.DATE,
      acknowledgedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'AlertRecipient'
    }
  )

  return AlertRecipient
}
