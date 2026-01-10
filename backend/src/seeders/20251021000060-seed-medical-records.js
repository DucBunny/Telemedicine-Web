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
    const records = []

    patients.forEach((pat) => {
      const randomDoc =
        doctors[Math.floor(Math.random() * doctors.length)].user_id

      const scenario = faker.helpers.arrayElement(medicalScenarios)

      records.push({
        patient_id: pat.user_id,
        doctor_id: randomDoc,
        diagnosis: faker.helpers.arrayElement(scenario.diagnoses),
        prescription: faker.helpers.arrayElement(scenario.prescriptions),
        notes: scenario.getNotes(),
        visit_date: faker.date.past({ months: 6 }),
        created_at: now,
        updated_at: now
      })
    })

    await queryInterface.bulkInsert('medical_records', records, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('medical_records', null, {})
  }
}

/**
 *  Kịch bản y khoa để tạo hồ sơ bệnh án phù hợp
 */
const medicalScenarios = [
  // Tim mạch (Liên quan BPM cao)
  {
    type: 'bpm',
    diagnoses: [
      'Tăng huyết áp độ 1',
      'Rối loạn nhịp tim nhanh',
      'Thiểu năng tuần hoàn não'
    ],
    prescriptions: [
      'Amlodipin 5mg (1 viên/sáng), Panangin (2 viên/ngày)',
      'Concor 2.5mg (1 viên/sáng), Aspirin 81mg',
      'Bisoprolol 5mg, Thuốc trợ tim Coenzyme Q10'
    ],
    getNotes: () =>
      `Nhịp tim trung bình cao (${faker.number.int({
        min: 100,
        max: 125
      })} bpm). Huyết áp dao động. Cần hạn chế muối.`
  },

  // Hô hấp (Liên quan SpO2 thấp)
  {
    type: 'spo2',
    diagnoses: [
      'Viêm phế quản cấp',
      'Hen phế quản nhẹ',
      'Viêm đường hô hấp trên'
    ],
    prescriptions: [
      'Ventolin (xịt khi khó thở), Ambroxol 30mg',
      'Kháng sinh Augmentin 1g, Alphachymotrypsin',
      'Salbutamol, Vitamin C liều cao'
    ],
    getNotes: () =>
      `SpO2 có lúc giảm xuống ${faker.number.int({
        min: 90,
        max: 94
      })}%. Nghe phổi có tiếng rít nhẹ.`
  },

  // Sức khỏe bình thường / Bệnh nhẹ
  {
    type: 'normal',
    diagnoses: [
      'Rối loạn tiêu hóa',
      'Đau đầu căng cơ',
      'Cảm cúm thông thường',
      'Suy nhược cơ thể'
    ],
    prescriptions: [
      'Men tiêu hóa Enterogermina, Oresol',
      'Paracetamol 500mg, Vitamin 3B',
      'Viên sủi Multivitamin, Nghỉ ngơi điều độ'
    ],
    getNotes: () =>
      `Các chỉ số sinh tồn ổn định (BPM: ${faker.number.int({
        min: 70,
        max: 85
      })}, SpO2: 98-99%).`
  }
]
