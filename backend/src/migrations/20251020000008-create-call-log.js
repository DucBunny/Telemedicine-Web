'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('call_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      caller_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Người dùng xóa nick thì vẫn giữ log nhưng null
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      duration_seconds: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('missed', 'rejected', 'completed'),
        defaultValue: 'missed'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('call_logs')
  }
}
