'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const patients = await queryInterface.sequelize.query(
      `SELECT user_id FROM patients;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const now = new Date()
    const devices = []

    // Gán thiết bị cho 30 bệnh nhân đầu tiên (hoặc tất cả nếu ít hơn 30)
    const deviceCount = Math.min(patients.length, 30)

    for (let i = 0; i < deviceCount; i++) {
      devices.push({
        device_id: 'ESP_' + (i + 1).toString().padStart(2, '0'),
        name: `Máy đo nhịp tim ESP32 #` + (i + 1).toString().padStart(2, '0'),
        status: faker.helpers.arrayElement(['active', 'active', 'maintenance']), // Tỷ lệ active cao hơn
        assigned_to: patients[i].user_id,
        created_at: now,
        updated_at: now
      })
    }

    // Tạo 10 thiết bị dự phòng (chưa gán cho ai - assigned_to: null)
    for (let i = 0; i < 10; i++) {
      devices.push({
        device_id: 'ESP_SPARE_' + (i + 1).toString().padStart(2, '0'),
        name: `Thiết bị dự phòng #` + (i + 1).toString().padStart(2, '0'),
        status: 'inactive',
        assigned_to: null,
        created_at: now,
        updated_at: now
      })
    }

    await queryInterface.bulkInsert('devices', devices, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('devices', null, {})
  }
}
