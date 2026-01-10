'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const doctors = await queryInterface.sequelize.query(
      `SELECT user_id FROM doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const patients = await queryInterface.sequelize.query(
      `SELECT user_id FROM patients;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const assignments = []
    patients.forEach((pat) => {
      const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)]
      assignments.push({
        patient_id: pat.user_id,
        doctor_id: randomDoctor.user_id,
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
