'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách cảnh báo để tạo người nhận cảnh báo phù hợp
    const alerts = await queryInterface.sequelize.query(
      `SELECT id, patient_id, created_at FROM alerts;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )

    // Lấy danh sách quan hệ patient-doctor
    const patientDoctors = await queryInterface.sequelize.query(
      `SELECT patient_id, doctor_id FROM patient_doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )

    // Tạo Map để dễ tra cứu doctors của mỗi patient
    const patientDoctorMap = {}
    patientDoctors.forEach((pd) => {
      if (!patientDoctorMap[pd.patient_id]) {
        patientDoctorMap[pd.patient_id] = []
      }
      patientDoctorMap[pd.patient_id].push(pd.doctor_id)
    })

    const alertRecipients = []

    // Duyệt qua từng cảnh báo để tạo người nhận cảnh báo
    for (const alert of alerts) {
      const assignedDoctors = patientDoctorMap[alert.patient_id] || []

      for (const doctor of assignedDoctors) {
        alertRecipients.push({
          alert_id: alert.id,
          doctor_id: doctor,
          delivered_at: alert.created_at,
        })
      }
    }

    await queryInterface.bulkInsert('alert_recipients', alertRecipients, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alert_recipients', null, {})
  },
}
