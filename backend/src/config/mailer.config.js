import { Resend } from 'resend'
import { env } from '@/config'

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

const connectMailer = async () => {
  if (!resend) {
    console.warn('[Mailer] RESEND_API_KEY is not set — email sending disabled.')
    return
  }
  console.log('[Mailer] Resend connected successfully.')
}

const sendEmail = async (to, subject, text, html) => {
  if (!resend) {
    console.error('[Mailer] RESEND_API_KEY is not set — cannot send email.')
    return false
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to,
      subject,
      text,
      html,
    })

    if (error) {
      console.error('[Mailer] Failed to send email:', error)
      return

      // console.error('[Mailer] Failed to send email:', {
      //   to,
      //   statusCode: error.statusCode,
      //   message: error.message,
      // })
      // return false
    }

    console.log('[Mailer] Email sent successfully.', { to, id: data?.id })
    return true
  } catch (error) {
    console.error('[Mailer] Failed to send email:', { to, error })
    return false
  }
}

export { connectMailer, sendEmail }
