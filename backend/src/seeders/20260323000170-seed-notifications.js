'use strict'
const { fakerVI: faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const patients = await queryInterface.sequelize.query(
      `SELECT user_id FROM patients;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )
    const doctors = await queryInterface.sequelize.query(
      `SELECT user_id FROM doctors;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )
    const appointments = await queryInterface.sequelize.query(
      `SELECT id, patient_id, doctor_id FROM appointments LIMIT 300;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    )

    const now = new Date()
    const notifications = []

    // Build maps for patient and doctor views of appointments
    const aptByPatient = {}
    const aptByDoctor = {}
    for (const apt of appointments) {
      if (!aptByPatient[apt.patient_id]) aptByPatient[apt.patient_id] = []
      aptByPatient[apt.patient_id].push(apt)

      if (!aptByDoctor[apt.doctor_id]) aptByDoctor[apt.doctor_id] = []
      aptByDoctor[apt.doctor_id].push(apt)
    }

    // Alerts per patient (if table exists)
    let alertByPatient = {}
    try {
      const alerts = await queryInterface.sequelize.query(
        `SELECT ar.id as recipient_id, ar.patient_id FROM alert_recipients ar LIMIT 300;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      )
      for (const a of alerts) {
        if (!alertByPatient[a.patient_id]) alertByPatient[a.patient_id] = []
        alertByPatient[a.patient_id].push(a.recipient_id)
      }
    } catch {
      // table may not exist yet — skip
    }

    const apptTitles = [
      'Lịch hẹn sắp tới',
      'Lịch hẹn đã được xác nhận',
      'Nhắc nhở lịch hẹn',
    ]
    const apptContents = [
      'Bạn có lịch hẹn khám sắp tới. Vui lòng đến đúng giờ.',
      'Lịch khám của bạn đã được bác sĩ xác nhận.',
      'Nhắc nhở: Lịch hẹn của bạn còn 2 tiếng nữa.',
    ]
    const alertTitles = [
      'Cảnh báo nhịp tim bất thường',
      'Chỉ số SpO₂ thấp',
      'Huyết áp cao cần chú ý',
    ]
    const alertContents = [
      'Nhịp tim của bạn đo được 115 bpm — cao hơn ngưỡng bình thường.',
      'SpO₂ của bạn đo được 91% — dưới ngưỡng an toàn 95%.',
      'Huyết áp tâm thu đạt 145 mmHg — vui lòng kiểm tra lại.',
    ]
    const msgTitles = ['Tin nhắn từ bác sĩ', 'Bác sĩ đã trả lời']
    const msgContents = [
      'Bác sĩ vừa gửi cho bạn một tin nhắn mới.',
      'Bác sĩ đã phản hồi câu hỏi của bạn. Hãy kiểm tra.',
    ]

    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const randBool = (pTrue = 0.4) => Math.random() < pTrue

    for (const patient of patients) {
      const pid = patient.user_id
      const myApts = aptByPatient[pid] || []
      const myAlerts = alertByPatient[pid] || []

      // appointment notifications
      for (let i = 0; i < myApts.length; i++) {
        const apt = myApts[i]
        const isRead = randBool(0.5)
        notifications.push({
          user_id: pid,
          type: 'appointment',
          title: rand(apptTitles),
          content: rand(apptContents),
          reference_id: apt.id,
          sender_id: apt.doctor_id,
          is_read: isRead,
          read_at: isRead
            ? new Date(
                now.getTime() - faker.number.int({ min: 60000, max: 86400000 }),
              )
            : null,
          created_at: new Date(
            now.getTime() - faker.number.int({ min: 3600000, max: 604800000 }),
          ),
          updated_at: now,
        })
      }

      // alert notifications
      for (let i = 0; i < myAlerts.length; i++) {
        const isRead = randBool(0.3) // mostly unread for alerts
        notifications.push({
          user_id: pid,
          type: 'alert',
          title: rand(alertTitles),
          content: rand(alertContents),
          reference_id: myAlerts[i],
          sender_id: null,
          is_read: isRead,
          read_at: isRead
            ? new Date(
                now.getTime() - faker.number.int({ min: 60000, max: 86400000 }),
              )
            : null,
          created_at: new Date(
            now.getTime() - faker.number.int({ min: 3600000, max: 259200000 }),
          ),
          updated_at: now,
        })
      }

      // 1–2 message notifications (from doctors they saw)
      const msgDoctors = myApts.slice(0, 2).map((a) => a.doctor_id)
      for (const doctorId of msgDoctors) {
        const isRead = randBool(0.4)
        notifications.push({
          user_id: pid,
          type: 'message',
          title: rand(msgTitles),
          content: rand(msgContents),
          reference_id: null,
          sender_id: doctorId,
          is_read: isRead,
          read_at: isRead
            ? new Date(
                now.getTime() - faker.number.int({ min: 60000, max: 43200000 }),
              )
            : null,
          created_at: new Date(
            now.getTime() - faker.number.int({ min: 60000, max: 172800000 }),
          ),
          updated_at: now,
        })
      }
    }

    const doctorApptTitles = [
      'Lịch hẹn mới từ bệnh nhân',
      'Nhắc lịch khám sắp tới',
      'Lịch hẹn đã được cập nhật',
    ]
    const doctorApptContents = [
      'Bạn có lịch hẹn mới với bệnh nhân. Vui lòng kiểm tra chi tiết.',
      'Lịch khám với bệnh nhân sắp diễn ra trong thời gian tới.',
      'Thông tin lịch hẹn với bệnh nhân vừa được cập nhật.',
    ]
    const doctorMsgTitles = [
      'Tin nhắn mới từ bệnh nhân',
      'Bệnh nhân đã phản hồi',
    ]
    const doctorMsgContents = [
      'Bạn vừa nhận được tin nhắn mới từ bệnh nhân.',
      'Bệnh nhân đã phản hồi cuộc trò chuyện của bạn.',
    ]

    for (const doctor of doctors) {
      const did = doctor.user_id
      const myApts = aptByDoctor[did] || []

      // appointment notifications for doctors
      for (let i = 0; i < myApts.length; i++) {
        const apt = myApts[i]
        const isRead = randBool(0.45)
        notifications.push({
          user_id: did,
          type: 'appointment',
          title: rand(doctorApptTitles),
          content: rand(doctorApptContents),
          reference_id: apt.id,
          sender_id: apt.patient_id,
          is_read: isRead,
          read_at: isRead
            ? new Date(
                now.getTime() - faker.number.int({ min: 60000, max: 86400000 }),
              )
            : null,
          created_at: new Date(
            now.getTime() - faker.number.int({ min: 3600000, max: 604800000 }),
          ),
          updated_at: now,
        })
      }

      // 1–3 message notifications (from patients they have seen)
      const msgPatients = [
        ...new Set(myApts.slice(0, 3).map((a) => a.patient_id)),
      ]
      for (const patientId of msgPatients) {
        const isRead = randBool(0.4)
        notifications.push({
          user_id: did,
          type: 'message',
          title: rand(doctorMsgTitles),
          content: rand(doctorMsgContents),
          reference_id: null,
          sender_id: patientId,
          is_read: isRead,
          read_at: isRead
            ? new Date(
                now.getTime() - faker.number.int({ min: 60000, max: 43200000 }),
              )
            : null,
          created_at: new Date(
            now.getTime() - faker.number.int({ min: 60000, max: 172800000 }),
          ),
          updated_at: now,
        })
      }
    }

    await queryInterface.bulkInsert('notifications', notifications, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications', null, {})
  },
}
