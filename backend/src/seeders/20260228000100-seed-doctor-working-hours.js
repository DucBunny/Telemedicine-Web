'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const doctors = await queryInterface.sequelize.query(
      `SELECT user_id FROM doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const now = new Date()
    const workingHours = []

    // Mỗi bác sĩ làm T2-T6 (1-5) sáng + chiều, T7 (6) chỉ sáng
    doctors.forEach((doc) => {
      // Thứ 2 đến Thứ 6: 08:00 – 12:00 và 13:30 – 17:00
      for (let day = 1; day <= 5; day++) {
        workingHours.push({
          doctor_id: doc.user_id,
          day_of_week: day,
          start_time: '08:00:00',
          end_time: '12:00:00',
          created_at: now,
          updated_at: now
        })
        workingHours.push({
          doctor_id: doc.user_id,
          day_of_week: day,
          start_time: '13:30:00',
          end_time: '17:00:00',
          created_at: now,
          updated_at: now
        })
      }

      // Thứ 7: chỉ buổi sáng 08:00 – 12:00
      workingHours.push({
        doctor_id: doc.user_id,
        day_of_week: 6,
        start_time: '08:00:00',
        end_time: '12:00:00',
        created_at: now,
        updated_at: now
      })
    })

    await queryInterface.bulkInsert('doctor_working_hours', workingHours, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctor_working_hours', null, {})
  }
}
