import { formatInTimeZone } from 'date-fns-tz'
import { env, sendEmail } from '@/config'

const formatAlertDateTime = (alert) => {
  const raw = alert.triggerTimestamp || alert.createdAt
  if (!raw) return '—'

  return formatInTimeZone(
    new Date(raw),
    env.APP_TIME_ZONE,
    'dd/MM/yyyy HH:mm:ss (zzz)',
  )
}

/**
 * Gửi email cảnh báo cho danh sách bác sĩ (chỉ khi tạo alert mới)
 */
export const sendAlertEmailToDoctors = async ({
  doctors,
  alert,
  patientName,
}) => {
  const subject = `[MedCare] Cảnh báo ECG — Bệnh nhân ${patientName || ''}`
  const formattedTime = formatAlertDateTime(alert)

  // Nội dung text email (dùng cho email client không hỗ trợ HTML)
  const text = [
    `Cảnh báo sức khỏe mới (ID: ${alert.id})`,
    `Bệnh nhân: ${patientName || alert.patientId}`,
    `Loại: ${alert.type}`,
    `Nội dung: ${alert.message}`,
    `Thời điểm: ${formattedTime}`,
    '',
    `Xem chi tiết: ${env.BASE_URL_FRONTEND}/doctor/alerts`,
  ].join('\n')

  // Nội dung HTML email
  const html = `
    <h2>Cảnh báo sức khỏe mới (ID: ${alert.id})</h2>
    <p><strong>Bệnh nhân:</strong> ${patientName || alert.patientId}</p>
    <p><strong>Loại:</strong> ${alert.type}</p>
    <p><strong>Nội dung:</strong> ${alert.message}</p>
    <p><strong>Thời điểm:</strong> ${formattedTime}</p>
    <p><a href="${env.BASE_URL_FRONTEND}/doctor/alerts">Xem chi tiết</a></p>
  `

  const recipients = doctors.filter((d) => d.email)

  if (recipients.length === 0) {
    console.warn('[Mail] No doctor emails to send alert notification.')
    return
  }

  await Promise.all(
    recipients.map((doctor) => sendEmail(doctor.email, subject, text, html)),
  )
}
