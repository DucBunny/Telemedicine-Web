'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patients', {
      user_id: {
        // Vừa là khóa chính, vừa là khóa ngoại (Quan hệ 1-1)
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa User thì xóa luôn thông tin chi tiết
      },
      date_of_birth: {
        type: Sequelize.DATEONLY
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other')
      },
      blood_type: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.FLOAT
      },
      weight: {
        type: Sequelize.FLOAT
      },
      medical_history: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.STRING
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Xóa bác sĩ thì hồ sơ này ko mất, chỉ null field doctor
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
    await queryInterface.dropTable('patients')
  }
}
