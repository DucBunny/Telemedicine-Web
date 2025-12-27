'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('devices', {
      device_id: {
        // Khóa chính là String (MAC Address)
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'maintenance'),
        defaultValue: 'active'
      },
      assigned_to_user_id: {
        // Gắn cho bệnh nhân nào
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('devices')
  }
}
