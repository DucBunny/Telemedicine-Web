'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {
      // 1-N với Doctor
      Specialty.hasMany(models.Doctor, {
        foreignKey: 'specialtyId',
        as: 'doctors'
      })
    }
  }

  Specialty.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      imageUrl: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      tableName: 'specialties',
      modelName: 'Specialty'
    }
  )

  return Specialty
}
