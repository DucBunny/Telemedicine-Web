'use strict'
const { fakerVI: faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = bcrypt.hashSync('123456', 10)
    const now = new Date()
    const usersData = []

    // 1. 1 Admin
    usersData.push({
      full_name: 'Quản trị viên',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: 'admin',
      phone_number: generateVNPhone(),
      status: 'active',
      created_at: now,
      updated_at: now,
    })

    // 2. Bot System
    usersData.push({
      full_name: 'Hệ thống tự động',
      email: 'system@gmail.com',
      password: bcrypt.hashSync(faker.string.uuid(), 10),
      role: 'doctor',
      status: 'locked',
      created_at: now,
      updated_at: now,
    })

    // 2. 50 Doctors => email: doctor3@gmail.com - doctor52@gmail.com
    for (let i = 3; i < 53; i++) {
      usersData.push({
        full_name: generateVNName(),
        email: `doctor${i}@gmail.com`,
        password: passwordHash,
        role: 'doctor',
        avatar: faker.image.avatar(),
        phone_number: generateVNPhone(),
        status: 'active',
        created_at: now,
        updated_at: now,
      })
    }

    // 3. 50 Patients => email: patient53@gmail.com - patient102@gmail.com
    for (let i = 53; i < 103; i++) {
      usersData.push({
        full_name: generateVNName(),
        email: `patient${i}@gmail.com`,
        password: passwordHash,
        role: 'patient',
        avatar: faker.image.avatar(),
        phone_number: generateVNPhone(),
        status: faker.helpers.arrayElement([
          'active',
          'active',
          'active',
          'locked',
        ]), // Random status với tỉ lệ cao là active
        created_at: now,
        updated_at: now,
      })
    }

    await queryInterface.bulkInsert('users', usersData, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  },
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
  const firstName = faker.person.firstName(sex).split(' ')[0]

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
  'Tuấn',
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
  'Bích',
]
