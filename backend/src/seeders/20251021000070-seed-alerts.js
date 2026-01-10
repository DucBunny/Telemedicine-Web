'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy hồ sơ bệnh án để tạo cảnh báo phù hợp
    const records = await queryInterface.sequelize.query(
      `SELECT patient_id, diagnosis FROM medical_records;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const now = new Date()
    const alerts = []

    // Duyệt qua từng hồ sơ bệnh án để xem có cần tạo cảnh báo không
    for (const record of records) {
      const diag = record.diagnosis.toLowerCase()
      let alertData = null

      // Nếu bệnh án là Tim mạch -> Tạo cảnh báo nhịp tim (BPM)
      if (diag.includes('nhịp tim') || diag.includes('huyết áp')) {
        // 70% cơ hội xảy ra cảnh báo nếu đã có bệnh nền
        if (Math.random() > 0.3) {
          alertData = {
            patient_id: record.patient_id,
            type: 'bpm',
            value: faker.number.int({ min: 110, max: 150 }),
            message: 'Cảnh báo: Nhịp tim vượt ngưỡng an toàn',
            severity: 'critical',
            source: 'device'
          }
        }
      }
      // Nếu bệnh án là Hô hấp -> Tạo cảnh báo SpO2
      else if (
        diag.includes('phế quản') ||
        diag.includes('hô hấp') ||
        diag.includes('hen')
      ) {
        if (Math.random() > 0.3) {
          alertData = {
            patient_id: record.patient_id,
            type: 'spo2',
            value: faker.number.int({ min: 90, max: 93 }),
            message: 'Cảnh báo: Nồng độ oxy trong máu thấp',
            severity: 'critical',
            source: 'device'
          }
        }
      }

      // Nếu khớp kịch bản thì push vào mảng
      if (alertData) {
        alerts.push({
          ...alertData,
          prediction_id: null,
          is_resolved: false,
          created_at: faker.date.recent({ days: 7 }),
          updated_at: now
        })
      }
    }

    if (alerts.length > 0) {
      await queryInterface.bulkInsert('alerts', alerts, {})
    }
    return
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alerts', null, {})
  }
}
