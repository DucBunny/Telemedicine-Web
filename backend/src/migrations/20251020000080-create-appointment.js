'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'patients',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'doctors',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      actual_ended_at: {
        type: Sequelize.DATE
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        defaultValue: 30,
        comment: '30 or 60 minutes'
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      type: {
        type: Sequelize.ENUM('online', 'offline'),
        defaultValue: 'online'
      },
      meeting_link: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.TEXT
      },
      cancel_reason: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('appointments')
  }
}
