'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    static associate(models) {
      // Người gửi
      ChatMessage.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      })

      // Người nhận
      ChatMessage.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver'
      })
    }
  }

  ChatMessage.init(
    {
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      attachmentUrl: DataTypes.STRING,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'ChatMessage'
    }
  )

  return ChatMessage
}
