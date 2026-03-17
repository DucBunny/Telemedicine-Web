'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    const specialties = [
      {
        name: 'Tim mạch',
        description: 'Điều trị các bệnh lý về tim, huyết áp và mạch máu.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/tim-mach.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Thần kinh',
        description: 'Chuyên khoa về não bộ, tủy sống và hệ thống thần kinh.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/than-kinh.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Nhi khoa',
        description: 'Chăm sóc và điều trị sức khỏe toàn diện cho trẻ em.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/nhi-khoa.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Da liễu',
        description: 'Khám và điều trị các bệnh lý về da, tóc và móng.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/da-lieu.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Xương khớp',
        description:
          'Điều trị các bệnh lý cơ xương khớp và chấn thương vận động.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/xuong-khop.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Mắt',
        description:
          'Chăm sóc thị lực, điều trị tật khúc xạ và các bệnh lý về mắt.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/mat.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Nội khoa',
        description:
          'Khám sức khỏe định kỳ và điều trị các bệnh nội khoa cơ bản.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/nội-khoa.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Hô hấp',
        description:
          'Chuyên điều trị hen suyễn, viêm phổi và các bệnh đường thở.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/hô-hấp.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Nội tiết',
        description: 'Điều trị tiểu đường, tuyến giáp và các rối loạn hormone.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/nội-tiết.png',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Tai Mũi Họng',
        description: 'Khám và điều trị các bệnh lý vùng tai, mũi và họng.',
        image_url:
          'https://res.cloudinary.com/de9s3pney/image/upload/telemedicine-hust/system/specialties/tai-mui-hong.png',
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('specialties', specialties, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specialties', null, {})
  }
}
