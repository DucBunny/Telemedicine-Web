'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const doctors = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'doctor';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const specialties = await queryInterface.sequelize.query(
      `SELECT id FROM specialties;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const now = new Date()
    const degrees = [
      'ThS.BS',
      'BSCKI',
      'BSCKII',
      'GS.TS.BS',
      'PGS.TS.BS',
      'ThS.BSCKI',
      'ThS.BSCKII'
    ]
    const universities = [
      'Đại học Y Dược TP.HCM',
      'Đại học Y Hà Nội',
      'Đại học Y Dược Cần Thơ',
      'Đại học Y Dược Huế',
      'Đại học Y Thái Bình'
    ]
    const addresses = [
      'Bệnh viện Chợ Rẫy',
      'Bệnh viện Bạch Mai',
      'Bệnh viện Đại học Y Dược TP.HCM',
      'Bệnh viện Việt Đức',
      'Bệnh viện Đại học Y Hà Nội'
    ]

    // Seed Doctors
    const doctorsData = doctors.map((doc, index) => ({
      user_id: doc.id,
      specialty_id:
        specialties.length > 0
          ? specialties[index % specialties.length].id
          : null,
      degree: faker.helpers.arrayElement(degrees),
      experience_years: faker.number.int({ min: 3, max: 20 }),
      bio: `Bác sĩ có nhiều năm kinh nghiệm tại các bệnh viện lớn. Tốt nghiệp loại giỏi tại ${faker.helpers.arrayElement(
        universities
      )}.`,
      address: faker.helpers.arrayElement(addresses),
      created_at: now,
      updated_at: now
    }))

    await queryInterface.bulkInsert('doctors', doctorsData, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctors', null, {})
  }
}
