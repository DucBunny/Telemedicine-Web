'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const patients = await queryInterface.sequelize.query(
      `SELECT id, full_name FROM users WHERE role = 'patient';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const now = new Date()
    const histories = [
      'Tiền sử bệnh tiểu đường',
      'Dị ứng thuốc kháng sinh',
      'Cao huyết áp mãn tính',
      'Không có tiền sử bệnh lý đặc biệt'
    ]
    const blood_types = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-']

    // Seed Patients
    const patientsData = patients.map((pat) => ({
      user_id: pat.id,
      date_of_birth: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
      gender: getGenderFromFullName(pat.full_name),
      blood_type: faker.helpers.arrayElement(blood_types),
      height: faker.number.int({ min: 150, max: 190 }),
      weight: faker.number.int({ min: 50, max: 90 }),
      medical_history: faker.helpers.arrayElement(histories),
      address: generateVNAddress(),
      created_at: now,
      updated_at: now
    }))
    await queryInterface.bulkInsert('patients', patientsData, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patients', null, {})
  }
}

/**
 * Hàm tạo địa chỉ chuẩn VN
 */
const generateVNAddress = () => {
  const number = faker.number.int({ min: 1, max: 999 })
  const streetName = `đường ${faker.person.lastName()} ${faker.person.firstName()}`
  const city = faker.location.city() // Hà Nội, Đà Nẵng...

  return `Số ${number} ${streetName}, ${city}`
}

/**
 * Hàm đoán giới tính từ tên đầy đủ
 */
const getGenderFromFullName = (fullName) => {
  // Tách tên thành mảng: "Nguyễn Thị Mai" -> ["Nguyễn", "Thị", "Mai"]
  const parts = fullName.split(' ')

  // Lấy chữ ở giữa (Tên đệm) giả sử tên đầy đủ có 3 phần
  const middleName = parts[1]

  if (femaleMiddle.includes(middleName)) {
    return 'female'
  }
  return 'male'
}

const femaleMiddle = [
  'Thị',
  'Ngọc',
  'Thu',
  'Thanh',
  'Hồng',
  'Phương',
  'Mai',
  'Thùy',
  'Kim',
  'Bích'
]
