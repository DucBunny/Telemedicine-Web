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
      assignedTo: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Device'
    }
  )

  return Device
}
