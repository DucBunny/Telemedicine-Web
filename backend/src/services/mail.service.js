import { formatDate } from 'date-fns'
import { env, sendEmail } from '@/config'

/**
 * Gửi email cảnh báo cho danh sách bác sĩ (chỉ khi tạo alert mới)
 */
export const sendAlertEmailToDoctors = async ({
  doctors,
  alert,
  patientName,
}) => {
  const subject = `[MedCare] Cảnh báo ECG — Bệnh nhân ${patientName || ''}`

  // Nội dung text email (dùng cho email client không hỗ trợ HTML)
  const text = [
    `Cảnh báo sức khỏe mới (ID: ${alert.id})`,
    `Bệnh nhân: ${patientName || alert.patientId}`,
    `Loại: ${alert.type}`,
    `Nội dung: ${alert.message}`,
    `Thời điểm: ${alert.triggerTimestamp || alert.createdAt}`,
    '',
    `Xem chi tiết: ${env.BASE_URL_FRONTEND}/doctor/alerts`,
  ].join('\n')

  // Nội dung HTML email
  const html = `
    <h2>Cảnh báo sức khỏe mới (ID: ${alert.id})</h2>
    <p><strong>Bệnh nhân:</strong> ${patientName || alert.patientId}</p>
    <p><strong>Loại:</strong> ${alert.type}</p>
    <p><strong>Nội dung:</strong> ${alert.message}</p>
    <p><strong>Thời điểm:</strong> ${formatDate(alert.triggerTimestamp || alert.createdAt, 'dd/MM/yyyy HH:mm:ss')}</p>
    <p><a href="${env.BASE_URL_FRONTEND}/doctor/alerts">Xem chi tiết</a></p>
  `

  await Promise.all(
    doctors
      .filter((d) => d.email)
      .map((doctor) => sendEmail(doctor.email, subject, text, html)),
  )
}
