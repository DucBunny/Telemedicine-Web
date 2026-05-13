'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const appointments = await queryInterface.sequelize.query(
      `SELECT DISTINCT patient_id, doctor_id FROM appointments WHERE status = 'confirmed' OR status = 'completed';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )

    // Tạo unique patient-doctor pairs để tránh trùng lặp
    const uniquePairs = new Map()

    appointments.forEach((appt) => {
      const key = `${appt.patient_id}_${appt.doctor_id}`
      if (!uniquePairs.has(key)) {
        uniquePairs.set(key, {
          patient_id: appt.patient_id,
          doctor_id: appt.doctor_id,
          role: 'primary',
          assigned_at: new Date(),
        })
      }
    })

    const assignments = Array.from(uniquePairs.values())

    if (assignments.length > 0) {
      await queryInterface.bulkInsert('patient_doctors', assignments, {})
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patient_doctors', null, {})
  },
}
