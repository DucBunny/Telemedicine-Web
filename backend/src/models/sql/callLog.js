'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CallLog extends Model {
    static associate(models) {
      // Người gọi
      CallLog.belongsTo(models.User, {
        foreignKey: 'callerId',
        as: 'caller',
      })

      // Người nghe
      CallLog.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver',
      })
    }
  }

  CallLog.init(
    {
      callerId: {
        type: DataTypes.INTEGER,
      },
      receiverId: {
        type: DataTypes.INTEGER,
      },
      durationSeconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('missed', 'rejected', 'completed'),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'call_logs',
      modelName: 'CallLog',
      updatedAt: false,
    },
  )

  return CallLog
}
