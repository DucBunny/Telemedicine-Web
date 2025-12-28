'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('123456', 10)

    await queryInterface.bulkInsert('users', [
      {
        full_name: 'Admin User',
        email: 'admin@gmail.com',
        password: passwordHash,
        role: 'admin',
        phone_number: '0123456789',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        full_name: 'Doctor User',
        email: 'doctor@gmail.com',
        password: passwordHash,
        role: 'doctor',
        phone_number: '0987654321',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  }
}
