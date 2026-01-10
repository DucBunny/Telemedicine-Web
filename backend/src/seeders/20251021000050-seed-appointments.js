'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const patients = await queryInterface.sequelize.query(
      `SELECT user_id FROM patients;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const doctors = await queryInterface.sequelize.query(
      `SELECT user_id FROM doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const now = new Date()
    const appointments = []

    const reasons = [
      'Đau đầu chóng mặt',
      'Khám định kỳ tháng',
      'Tức ngực khó thở',
      'Tái khám sau điều trị'
    ]

    patients.forEach((pat) => {
      const randomDoc =
        doctors[Math.floor(Math.random() * doctors.length)].user_id

      const startDate = faker.date.recent({ days: 30 })
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000) // Meet 30 phút

      // 1 Lịch sử khám (Đã xong)
      appointments.push({
        patient_id: pat.user_id,
        doctor_id: randomDoc,
        scheduled_at: startDate,
        ended_at: endDate,
        status: 'completed',
        meeting_link: null,
        reason: faker.helpers.arrayElement(reasons),
        created_at: now,
        updated_at: now
      })

      // 1 Lịch hẹn sắp tới (Chờ xác nhận)
      appointments.push({
        patient_id: pat.user_id,
        doctor_id: randomDoc,
        scheduled_at: faker.date.soon({ days: 14 }),
        status: 'pending',
        reason: faker.helpers.arrayElement(reasons),
        meeting_link: 'https://meet.google.com/xxx-yyyy-zzz',
        created_at: now,
        updated_at: now
      })
    })

    await queryInterface.bulkInsert('appointments', appointments, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('appointments', null, {})
  }
}
