'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alerts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      prediction_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'health_predictions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      type: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.FLOAT
      },
      message: {
        type: Sequelize.STRING
      },
      severity: {
        type: Sequelize.ENUM('low', 'medium', 'critical'),
        defaultValue: 'medium'
      },
      source: {
        type: Sequelize.STRING
      },
      is_resolved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      acknowledged_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'doctors',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      acknowledged_at: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('alerts')
  }
}
