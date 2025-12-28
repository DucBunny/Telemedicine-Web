'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      // Refresh Token thuộc về 1 User
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }

  RefreshToken.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      deviceInfo: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'RefreshToken'
    }
  )

  return RefreshToken
}
