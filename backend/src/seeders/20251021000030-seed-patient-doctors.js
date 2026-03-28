'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const patients = await queryInterface.sequelize.query(
      `SELECT user_id FROM patients;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const assignments = []
    patients.forEach((pat) => {
      assignments.push({
        patient_id: pat.user_id,
        doctor_id: faker.number.int({ min: 2, max: 6 }), // Chỉ gán cho 5 bác sĩ đầu tiên để đảm bảo mỗi bác sĩ có nhiều bệnh nhân
        role: 'primary',
        assigned_at: new Date()
      })
    })

    await queryInterface.bulkInsert('patient_doctors', assignments, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patient_doctors', null, {})
  }
}
