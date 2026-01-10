'use strict'
const { fakerVI: faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = bcrypt.hashSync('123456', 10)
    const now = new Date()
    const usersData = []

    // 1. Admin
    usersData.push({
      full_name: 'Quản trị viên',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: 'admin',
      phone_number: generateVNPhone(),
      status: 'active',
      created_at: now,
      updated_at: now
    })

    // 2. Doctors
    for (let i = 0; i < 5; i++) {
      usersData.push({
        full_name: generateVNName(),
        email: `doctor${i + 1}@gmail.com`,
        password: passwordHash,
        role: 'doctor',
        avatar: faker.image.avatar(),
        phone_number: generateVNPhone(),
        status: 'active',
        created_at: now,
        updated_at: now
      })
    }

    // 3. Patients
    for (let i = 0; i < 50; i++) {
      usersData.push({
        full_name: generateVNName(),
        email: `patient${i + 1}@gmail.com`,
        password: passwordHash,
        role: 'patient',
        avatar: faker.image.avatar(),
        phone_number: generateVNPhone(),
        status: faker.helpers.arrayElement([
          'active',
          'active',
          'active',
          'locked'
        ]), // Random status với tỉ lệ cao là active
        created_at: now,
        updated_at: now
      })
    }

    return queryInterface.bulkInsert('users', usersData, {})
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  }
}

/**
 * Hàm tạo số điện thoại Việt Nam hợp lệ
 */
const generateVNPhone = () => {
  const prefixes = ['09', '03', '07', '08', '05']
  const prefix = faker.helpers.arrayElement(prefixes)
  const suffix = faker.string.numeric(8) // Random 8 số cuối
  return `${prefix}${suffix}` // Ví dụ: 0912345678
}

/**
 * Hàm tạo tên Việt Nam hợp lệ
 */
const generateVNName = () => {
  // Lấy ngẫu nhiên giới tính để tên và đệm khớp nhau (Văn/Thị)
  const sex = faker.person.sexType()
  const lastName = faker.person.lastName(sex)
  const firstName = faker.person.firstName(sex)

  const middleName =
    sex === 'male'
      ? faker.helpers.arrayElement(maleMiddle)
      : faker.helpers.arrayElement(femaleMiddle)

  return `${lastName} ${middleName} ${firstName}`
}

const maleMiddle = [
  'Văn',
  'Đức',
  'Hữu',
  'Mạnh',
  'Quang',
  'Thành',
  'Minh',
  'Hoàng',
  'Công',
  'Tuấn'
]

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
