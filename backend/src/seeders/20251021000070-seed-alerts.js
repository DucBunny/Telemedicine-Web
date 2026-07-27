'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách thiết bị đã được gán cho bệnh nhân
    const devices = await queryInterface.sequelize.query(
      `SELECT id, assigned_to FROM devices WHERE is_assigned = true;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )

    // Lấy danh sách bệnh án theo bệnh nhân đã được gán thiết bị
    const records = await queryInterface.sequelize.query(
      `
      SELECT mr.patient_id, mr.diagnosis 
      FROM medical_records mr 
      WHERE mr.patient_id 
      IN (SELECT DISTINCT assigned_to FROM devices WHERE is_assigned = true);
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )

    // Lấy danh sách quan hệ patient-doctor
    const patientDoctors = await queryInterface.sequelize.query(
      `SELECT patient_id, doctor_id FROM patient_doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )

    // Tạo Map để dễ tra cứu doctors của mỗi patient
    const patientDoctorMap = {}
    patientDoctors.forEach((pd) => {
      if (!patientDoctorMap[pd.patient_id]) {
        patientDoctorMap[pd.patient_id] = []
      }
      patientDoctorMap[pd.patient_id].push(pd.doctor_id)
    })

    const now = new Date()
    const alerts = []

    // Duyệt qua từng hồ sơ bệnh án để xem có cần tạo cảnh báo không
    for (const record of records) {
      if (!record.diagnosis) continue

      const diag = record.diagnosis.toLowerCase()
      let alertData = null

      // Lấy danh sách bác sĩ có quan hệ với bệnh nhân này
      const assignedDoctors = patientDoctorMap[record.patient_id] || []

      // Nếu không có doctor nào được gán, bỏ qua alert này
      if (assignedDoctors.length === 0) continue

      const status = faker.helpers.arrayElement([
        'handling',
        'resolved',
        'resolved',
        'resolved',
        'resolved',
        'resolved',
      ]) // 70% đã xử lý
      const createdAt = faker.date.recent({ days: 7 })
      const resolvedAt = faker.date.between({
        from: createdAt,
        to: new Date(
          Math.min(now.getTime(), createdAt.getTime() + 30 * 60 * 1000),
        ),
      }) // Xử lý trong vòng 30 phút sau khi cảnh báo

      // Nếu bệnh án là Tim mạch
      if (diag.includes('nhịp tim') || diag.includes('huyết áp')) {
        // 70% cơ hội xảy ra cảnh báo nếu đã có bệnh nền
        if (Math.random() > 0.3) {
          alertData = {
            patient_id: record.patient_id,
            device_id: devices.find((d) => d.assigned_to == record.patient_id)
              ?.id,
            type: 'ecg_S',
            message: 'Phát hiện ngoại tâm thu trên thất (S)',
            trigger_timestamp: createdAt,
            last_detected_at: createdAt,
            anomaly_count: faker.number.int({ min: 1, max: 5 }),
            status: status,
            handled_by:
              status !== 'pending'
                ? faker.helpers.arrayElement(assignedDoctors)
                : null,
            resolved_at: status === 'resolved' ? resolvedAt : null,
            created_at: createdAt,
            updated_at: status === 'resolved' ? resolvedAt : createdAt,
          }
        }
      }
      // Nếu bệnh án là Hô hấp
      else if (
        diag.includes('phế quản') ||
        diag.includes('hô hấp') ||
        diag.includes('hen')
      ) {
        if (Math.random() > 0.3) {
          alertData = {
            patient_id: record.patient_id,
            device_id: devices.find((d) => d.assigned_to == record.patient_id)
              ?.id,
            type: 'ecg_F',
            message: 'Phát hiện nhịp hỗn hợp (F)',
            trigger_timestamp: createdAt,
            last_detected_at: createdAt,
            anomaly_count: faker.number.int({ min: 1, max: 5 }),
            status: status,
            handled_by:
              status !== 'pending'
                ? faker.helpers.arrayElement(assignedDoctors)
                : null,
            resolved_at: status === 'resolved' ? resolvedAt : null,
            created_at: createdAt,
            updated_at: status === 'resolved' ? resolvedAt : createdAt,
          }
        }
      }

      // Nếu khớp kịch bản thì push vào mảng (bỏ qua nếu không có thiết bị)
      if (alertData?.device_id) {
        alerts.push({
          ...alertData,
        })
      }
    }

    await queryInterface.bulkInsert('alerts', alerts, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alerts', null, {})
  },
}
