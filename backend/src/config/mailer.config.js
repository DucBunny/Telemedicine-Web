import nodemailer from 'nodemailer'
import { env } from '@/config'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

const connectMailer = async () => {
  try {
    await transporter.verify()
    console.log('[Mailer] Connected successfully.')
  } catch (error) {
    console.error('[Mailer] Failed to connect to SMTP server:', error)
  }
}

const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM || env.SMTP_USER,
      to,
      subject,
      text,
      html,
    })
    console.log('[Mailer] Email sent successfully.')
  } catch (error) {
    console.error('[Mailer] Failed to send email:', error)
  }
}

export { transporter, connectMailer, sendEmail }
