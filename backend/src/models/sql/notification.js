'use strict'
const { Model } = require('sequelize')
const { makePaginate } = require('sequelize-cursor-pagination')

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Thông báo thuộc về 1 user (người nhận)
      Notification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })

      // Thông báo có thể có người gửi
      Notification.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      })
    }
  }

  Notification.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      type: {
        type: DataTypes.ENUM('alert', 'appointment', 'message'),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING
      },
      content: {
        type: DataTypes.TEXT
      },
      referenceId: {
        type: DataTypes.INTEGER,
        field: 'reference_id'
      },
      senderId: {
        type: DataTypes.INTEGER,
        field: 'sender_id'
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read'
      },
      readAt: {
        type: DataTypes.DATE,
        field: 'read_at'
      }
    },
    {
      sequelize,
      tableName: 'notifications',
      modelName: 'Notification',
      paranoid: true, // Soft delete
      indexes: [
        {
          // Hỗ trợ lọc thông báo của một user cụ thể cực nhanh
          name: 'idx_notifications_user_id',
          fields: ['user_id']
        },
        {
          // Hỗ trợ cursorPaginate khi sắp xếp theo mới nhất
          name: 'idx_notifications_cursor',
          fields: ['created_at', 'id']
        },
        {
          // Hỗ trợ lọc thông báo chưa đọc
          name: 'idx_notifications_is_read',
          fields: ['is_read']
        }
      ]
    }
  )

  // Thiết lập pagination với cursor
  Notification.cursorPaginate = makePaginate(Notification)

  return Notification
}
