'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('health_predictions', {
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
        onDelete: 'CASCADE'
      },
      predicted_status: {
        type: Sequelize.ENUM('normal', 'warning', 'critical')
      },
      confidence: {
        type: Sequelize.FLOAT
      },
      model_version: {
        type: Sequelize.STRING
      },
      input_window: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('health_predictions')
  }
}
