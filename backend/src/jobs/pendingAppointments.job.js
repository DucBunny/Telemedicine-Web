import cron from 'node-cron'
import { env } from '@/config/env'
import * as appointmentService from '@/services/appointment.service'

/**
 * Cron job auto-cancel pending appointments đã quá giờ hẹn.
 */
export const schedulePendingAppointmentExpiryJob = () => {
  const expr = env.APPOINTMENT_PENDING_EXPIRE_CRON
  if (!cron.validate(expr)) {
    console.warn(
      `[Cron Job] Invalid APPOINTMENT_PENDING_EXPIRE_CRON "${expr}", skipping scheduler`,
    )
    return
  }

  cron.schedule(expr, async () => {
    try {
      const n = await appointmentService.expireStalePendingAppointments()
      if (n > 0)
        console.log(
          `[Cron Job] Auto-cancelled ${n} stale pending appointment(s)`,
        )
    } catch (err) {
      console.error('[Cron Job] expireStalePendingAppointments failed:', err)
    }
  })

  console.log(`[Cron Job] Pending appointment expiry scheduled (${expr})`)
}
