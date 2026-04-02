'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const patients = await queryInterface.sequelize.query(
      `SELECT user_id FROM patients;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const now = new Date()
    const appointments = []

    const types = ['online', 'offline']
    const reasons = [
      'Đau đầu chóng mặt',
      'Khám định kỳ tháng',
      'Tức ngực khó thở',
      'Tái khám sau điều trị'
    ]

    patients.forEach((pat) => {
      for (let i = 0; i < 3; i++) {
        const scheduled_at = generateTime(faker.date.recent({ days: 30 }))

        // 3 Lịch sử khám (Đã xong)
        appointments.push({
          patient_id: pat.user_id,
          doctor_id: faker.number.int({ min: 2, max: 6 }), // Chỉ gán cho 5 bác sĩ đầu tiên để đảm bảo mỗi bác sĩ có nhiều bệnh nhân
          scheduled_at: scheduled_at,
          actual_ended_at: new Date(scheduled_at.getTime() + 30 * 60 * 1000),
          duration_minutes: 30,
          status: 'completed',
          type: faker.helpers.arrayElement(types),
          meeting_link: null,
          reason: faker.helpers.arrayElement(reasons),
          created_at: now,
          updated_at: now
        })

        // 3 Lịch hẹn sắp tới (Đã xác nhận, Chờ duyệt)
        appointments.push({
          patient_id: pat.user_id,
          doctor_id: faker.number.int({ min: 2, max: 6 }), // Chỉ gán cho 5 bác sĩ đầu tiên để đảm bảo mỗi bác sĩ có nhiều bệnh nhân
          scheduled_at: generateTime(faker.date.soon({ days: 7 })),
          actual_ended_at: null,
          duration_minutes: 30,
          status: faker.helpers.arrayElement(['pending', 'confirmed']),
          type: faker.helpers.arrayElement(types),
          meeting_link: 'https://meet.google.com/xxx-yyyy-zzz',
          reason: faker.helpers.arrayElement(reasons),
          created_at: now,
          updated_at: now
        })

        // 3 Lịch hẹn đã hủy
        appointments.push({
          patient_id: pat.user_id,
          doctor_id: faker.number.int({ min: 2, max: 6 }), // Chỉ gán cho 5 bác sĩ đầu tiên để đảm bảo mỗi bác sĩ có nhiều bệnh nhân
          scheduled_at: generateTime(faker.date.recent({ days: 7 })),
          actual_ended_at: null,
          duration_minutes: 30,
          status: 'cancelled',
          type: faker.helpers.arrayElement(types),
          cancel_reason: 'Bệnh nhân có việc đột xuất, xin hủy lịch hẹn.',
          created_at: now,
          updated_at: now
        })
      }
    })

    await queryInterface.bulkInsert('appointments', appointments, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('appointments', null, {})
  }
}

/**
 * Hàm tạo thời gian tròn 30 phút (eg: 8:00, 8:30, 9:00, ...)
 */
function generateTime(date) {
  const hours = [8, 9, 10, 11, 14, 15, 16]
  const minutes = [0, 30]

  const hour = faker.helpers.arrayElement(hours)
  const minute = faker.helpers.arrayElement(minutes)

  const d = new Date(date)
  d.setHours(hour, minute, 0, 0)

  return d
}
