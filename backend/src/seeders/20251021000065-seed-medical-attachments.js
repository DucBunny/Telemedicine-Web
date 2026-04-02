'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const medicalRecords = await queryInterface.sequelize.query(
      `SELECT id FROM medical_records;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const attachmentTemplates = [
      {
        fileType: 'image/jpeg',
        extension: 'jpg',
        namePrefix: 'xray'
      },
      {
        fileType: 'image/png',
        extension: 'png',
        namePrefix: 'lab-result'
      },
      {
        fileType: 'application/pdf',
        extension: 'pdf',
        namePrefix: 'prescription'
      }
    ]

    const attachments = []

    for (const record of medicalRecords) {
      const attachmentCount = faker.number.int({ min: 2, max: 3 })

      for (let i = 0; i < attachmentCount; i++) {
        const template = faker.helpers.arrayElement(attachmentTemplates)
        const uniqueSuffix = faker.string.alphanumeric(8).toLowerCase()
        const fileName = `${template.namePrefix}-${record.id}-${i + 1}.${template.extension}`

        attachments.push({
          medical_record_id: record.id,
          file_name: fileName,
          file_url: `https://res.cloudinary.com/demo/image/upload/v1/medical-records/${uniqueSuffix}-${fileName}`,
          file_type: template.fileType,
          uploaded_at: faker.date.recent({ days: 30 })
        })
      }
    }

    await queryInterface.bulkInsert('medical_attachments', attachments, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('medical_attachments', null, {})
  }
}
