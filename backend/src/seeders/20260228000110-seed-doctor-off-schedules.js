'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const doctors = await queryInterface.sequelize.query(
      `SELECT user_id FROM doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const now = new Date()
    const offSchedules = []

    const reasons = [
      'Nghỉ phép cá nhân',
      'Hội nghị chuyên ngành',
      'Đào tạo nâng cao',
      'Công tác ngoại viện'
    ]

    // Mỗi bác sĩ có 1-2 ngày nghỉ trong 30 ngày tới
    doctors.forEach((doc) => {
      const numOffDays = faker.number.int({ min: 1, max: 2 })

      for (let i = 0; i < numOffDays; i++) {
        const offDate = faker.date.soon({ days: 30 })
        const dateOnly = offDate.toISOString().split('T')[0]

        // 50% nghỉ cả ngày, 50% nghỉ buổi chiều
        const isFullDay = faker.datatype.boolean()

        offSchedules.push({
          doctor_id: doc.user_id,
          off_date: dateOnly,
          start_time: isFullDay ? null : '13:30:00',
          end_time: isFullDay ? null : '17:00:00',
          reason: faker.helpers.arrayElement(reasons),
          created_at: now,
          updated_at: now
        })
      }
    })

    await queryInterface.bulkInsert('doctor_off_schedules', offSchedules, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctor_off_schedules', null, {})
  }
}
