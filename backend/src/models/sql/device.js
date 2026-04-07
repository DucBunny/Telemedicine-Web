'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      // Thiết bị thuộc về 1 bệnh nhân
      Device.belongsTo(models.Patient, {
        foreignKey: 'assignedTo',
        targetKey: 'userId',
        as: 'patient'
      })
    }
  }

  Device.init(
    {
      name: {
        type: DataTypes.STRING
      },
      isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isAssigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'patients',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    },
    {
      sequelize,
      tableName: 'devices',
      modelName: 'Device'
    }
  )

  return Device
}
