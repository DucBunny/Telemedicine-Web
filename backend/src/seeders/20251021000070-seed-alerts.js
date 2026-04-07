'use strict'
const { fakerVI: faker, de } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const devices = await queryInterface.sequelize.query(
      `SELECT id, assigned_to FROM devices WHERE is_assigned = true;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const records = await queryInterface.sequelize.query(
      `
      SELECT mr.patient_id, mr.diagnosis 
      FROM medical_records mr 
      WHERE mr.patient_id 
      IN (SELECT DISTINCT assigned_to FROM devices WHERE is_assigned = true);
      `,
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
            device_id: devices.find((d) => d.assigned_to === record.patient_id)
              ?.id,
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
            device_id: devices.find((d) => d.assigned_to === record.patient_id)
              ?.id,
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

    await queryInterface.bulkInsert('alerts', alerts, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alerts', null, {})
  }
}
