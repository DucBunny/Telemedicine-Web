'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const doctors = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'doctor';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const now = new Date()
    const specializations = ['Tim mạch', 'Đa khoa', 'Hô hấp']
    const degrees = [
      'Tiến sĩ',
      'Thạc sĩ',
      'Bác sĩ CK I',
      'Bác sĩ CK II',
      'Giáo sư'
    ]
    const universities = [
      'Đại học Y Dược TP.HCM',
      'Đại học Y Hà Nội',
      'Đại học Y Dược Cần Thơ',
      'Đại học Y Dược Huế',
      'Đại học Y Thái Bình'
    ]

    // Seed Doctors
    const doctorsData = doctors.map((doc) => ({
      user_id: doc.id,
      specialization: faker.helpers.arrayElement(specializations),
      degree: faker.helpers.arrayElement(degrees),
      experience_years: faker.number.int({ min: 3, max: 20 }),
      bio: `Bác sĩ có nhiều năm kinh nghiệm tại các bệnh viện lớn. Tốt nghiệp loại giỏi tại ${faker.helpers.arrayElement(
        universities
      )}.`,
      created_at: now,
      updated_at: now
    }))
    await queryInterface.bulkInsert('doctors', doctorsData, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctors', null, {})
  }
}
