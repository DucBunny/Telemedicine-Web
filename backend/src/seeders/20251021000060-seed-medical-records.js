'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy tất cả lịch hẹn đã hoàn thành (mỗi record gắn với 1 appointment)
    const appointments = await queryInterface.sequelize.query(
      `SELECT id, patient_id, doctor_id FROM appointments WHERE status = 'completed';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const now = new Date()
    const records = []

    appointments.forEach((appt) => {
      const scenario = faker.helpers.arrayElement(medicalScenarios)

      records.push({
        appointment_id: appt.id,
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
        symptoms: scenario.getSymptoms(),
        diagnosis: faker.helpers.arrayElement(scenario.diagnoses),
        treatment_plan: faker.helpers.arrayElement(scenario.treatmentPlans),
        prescription: JSON.stringify(faker.helpers.arrayElement(scenario.prescriptions)),
        notes: scenario.getNotes(),
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
 * Kịch bản y khoa để tạo hồ sơ bệnh án phù hợp
 */
const medicalScenarios = [
  // Tim mạch (Liên quan BPM cao)
  {
    type: 'bpm',
    getSymptoms: () =>
      `Đau tức ngực, hồi hộp, nhịp tim nhanh (${faker.number.int({ min: 100, max: 125 })} bpm), chóng mặt khi đứng dậy.`,
    diagnoses: [
      'Tăng huyết áp độ 1',
      'Rối loạn nhịp tim nhanh',
      'Thiểu năng tuần hoàn não'
    ],
    treatmentPlans: [
      'Dùng thuốc hạ áp, hạn chế muối < 5g/ngày, theo dõi huyết áp tại nhà.',
      'Nghỉ ngơi, giảm căng thẳng, tái khám sau 2 tuần.',
      'Điều chỉnh chế độ ăn, tập thể dục nhẹ, kiểm soát cân nặng.'
    ],
    prescriptions: [
      [
        { name: 'Amlodipin 5mg', dosage: '1 viên/sáng', duration: '30 ngày' },
        { name: 'Panangin', dosage: '2 viên/ngày', duration: '30 ngày' }
      ],
      [
        { name: 'Concor 2.5mg', dosage: '1 viên/sáng', duration: '14 ngày' },
        { name: 'Aspirin 81mg', dosage: '1 viên/chiều (sau ăn)', duration: '14 ngày' }
      ],
      [
        { name: 'Bisoprolol 5mg', dosage: '1 viên/sáng', duration: '30 ngày' },
        { name: 'Coenzyme Q10', dosage: '1 viên/ngày', duration: '30 ngày' }
      ]
    ],
    getNotes: () =>
      `Nhịp tim trung bình cao (${faker.number.int({ min: 100, max: 125 })} bpm). Huyết áp dao động. Cần hạn chế muối và theo dõi định kỳ.`
  },

  // Hô hấp (Liên quan SpO2 thấp)
  {
    type: 'spo2',
    getSymptoms: () =>
      `Khó thở nhẹ, ho khan, SpO2 giảm còn ${faker.number.int({ min: 90, max: 94 })}%, nghe phổi có tiếng rít nhẹ.`,
    diagnoses: [
      'Viêm phế quản cấp',
      'Hen phế quản nhẹ',
      'Viêm đường hô hấp trên'
    ],
    treatmentPlans: [
      'Xịt thuốc giãn phế quản khi khó thở, tránh tiếp xúc khói bụi, tái khám nếu nặng hơn.',
      'Uống nhiều nước ấm, nghỉ ngơi, dùng kháng sinh theo chỉ định.',
      'Vệ sinh mũi họng hằng ngày, tránh lạnh đột ngột, bổ sung Vitamin C.'
    ],
    prescriptions: [
      [
        { name: 'Ventolin (xịt)', dosage: 'Xịt khi khó thở, tối đa 4 lần/ngày', duration: '7 ngày' },
        { name: 'Ambroxol 30mg', dosage: '1 viên x 3 lần/ngày (sau ăn)', duration: '7 ngày' }
      ],
      [
        { name: 'Augmentin 1g', dosage: '1 viên x 2 lần/ngày (sau ăn)', duration: '7 ngày' },
        { name: 'Alphachymotrypsin', dosage: '2 viên x 3 lần/ngày', duration: '5 ngày' }
      ],
      [
        { name: 'Salbutamol 4mg', dosage: '1 viên x 3 lần/ngày', duration: '5 ngày' },
        { name: 'Vitamin C 500mg', dosage: '1 viên/ngày', duration: '14 ngày' }
      ]
    ],
    getNotes: () =>
      `SpO2 có lúc giảm xuống ${faker.number.int({ min: 90, max: 94 })}%. Hướng dẫn bệnh nhân tự theo dõi bằng máy đo SpO2 tại nhà.`
  },

  // Sức khỏe bình thường / Bệnh nhẹ
  {
    type: 'normal',
    getSymptoms: () =>
      `Mệt mỏi, ăn uống kém, đau đầu nhẹ, chỉ số sinh tồn ổn định (BPM: ${faker.number.int({ min: 70, max: 85 })}, SpO2: 98-99%).`,
    diagnoses: [
      'Rối loạn tiêu hóa',
      'Đau đầu căng cơ',
      'Cảm cúm thông thường',
      'Suy nhược cơ thể'
    ],
    treatmentPlans: [
      'Ăn uống điều độ, uống đủ nước, nghỉ ngơi hợp lý.',
      'Giảm stress, tập thể dục nhẹ, bổ sung vitamin tổng hợp.',
      'Dùng thuốc theo chỉ định, tái khám sau 1 tuần nếu không cải thiện.'
    ],
    prescriptions: [
      [
        { name: 'Enterogermina', dosage: '1 lọ x 2 lần/ngày', duration: '5 ngày' },
        { name: 'Oresol', dosage: 'Pha 1 gói / 200ml nước khi cần', duration: 'Khi có triệu chứng' }
      ],
      [
        { name: 'Paracetamol 500mg', dosage: '1 viên khi đau đầu, cách 6 giờ/lần', duration: '3 ngày' },
        { name: 'Vitamin 3B', dosage: '1 viên/ngày (sau ăn)', duration: '14 ngày' }
      ],
      [
        { name: 'Multivitamin', dosage: '1 viên sủi/ngày (pha với nước)', duration: '14 ngày' }
      ]
    ],
    getNotes: () =>
      `Các chỉ số sinh tồn ổn định. Bệnh nhân cần nghỉ ngơi đủ giấc và duy trì lối sống lành mạnh.`
  }
]
