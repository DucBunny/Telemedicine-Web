'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CallLog extends Model {
    static associate(models) {
      // Người gọi
      CallLog.belongsTo(models.User, {
        foreignKey: 'callerId',
        as: 'caller'
      })

      // Người nghe
      CallLog.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver'
      })
    }
  }

  CallLog.init(
    {
      callerId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      durationSeconds: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM('missed', 'rejected', 'completed'),
        defaultValue: 'missed'
      }
    },
    {
      sequelize,
      modelName: 'CallLog',
      tableName: 'call_logs'
    }
  )

  return CallLog
}
