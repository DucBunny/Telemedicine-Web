'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách cảnh báo để tạo người nhận cảnh báo phù hợp
    const alerts = await queryInterface.sequelize.query(
      `SELECT id, patient_id, created_at FROM alerts;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // Lấy danh sách bác sĩ phụ trách bệnh nhân
    const patient_doctors = await queryInterface.sequelize.query(
      `SELECT doctor_id, patient_id FROM patient_doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const alertRecipients = []

    // Duyệt qua từng cảnh báo để tạo người nhận cảnh báo
    for (const alert of alerts) {
      // Tìm bác sĩ phụ trách bệnh nhân
      const doctorEntry = patient_doctors.find(
        (entry) => entry.patient_id === alert.patient_id
      )
      if (doctorEntry) {
        alertRecipients.push({
          alert_id: alert.id,
          doctor_id: doctorEntry.doctor_id,
          delivered_at: alert.created_at
        })
      }
    }

    if (alertRecipients.length > 0) {
      await queryInterface.bulkInsert('alert_recipients', alertRecipients, {})
    }
    return
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alert_recipients', null, {})
  }
}
