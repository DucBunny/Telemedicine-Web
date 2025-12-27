'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      // Thiết bị thuộc về 1 bệnh nhân
      Device.belongsTo(models.User, {
        foreignKey: 'assignedToUserId',
        as: 'patient'
      })
    }
  }

  Device.init(
    {
      deviceId: {
        type: DataTypes.STRING,
        primaryKey: true, // Dùng MAC Address hoặc Serial Number làm ID
        allowNull: false
      },
      name: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
        defaultValue: 'active'
      },
      assignedToUserId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Device'
    }
  )

  return Device
}
