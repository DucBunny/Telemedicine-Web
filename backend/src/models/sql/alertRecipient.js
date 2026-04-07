'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class AlertRecipient extends Model {
    static associate(models) {}
  }

  AlertRecipient.init(
    {
      alertId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      doctorId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isAcknowledged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      readAt: {
        type: DataTypes.DATE
      },
      acknowledgedAt: {
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: 'alert_recipients',
      modelName: 'AlertRecipient',
      createdAt: 'deliveredAt',
      updatedAt: false
    }
  )

  return AlertRecipient
}
