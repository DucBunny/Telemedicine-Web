import cron from 'node-cron'
import { env } from '@/config'
import * as alertService from '@/services/alert.service'

/**
 * Cron job auto-resolves open alerts that have been stale for too long
 */
export const scheduleStaleAlertAutoResolveJob = () => {
  const expr = env.ALERT_AUTO_RESOLVE_CRON
  if (!cron.validate(expr)) {
    console.warn(
      `[Cron Job] Invalid ALERT_AUTO_RESOLVE_CRON "${expr}", skipping scheduler`,
    )
    return
  }

  cron.schedule(expr, async () => {
    try {
      const resolvedCount = await alertService.autoResolveStaleAlerts({
        botDoctorId: env.SYSTEM_BOT_DOCTOR_ID,
        olderThanHours: env.ALERT_AUTO_RESOLVE_AFTER_HOURS,
      })

      if (resolvedCount > 0)
        console.log(
          `[Cron Job] Auto-resolved ${resolvedCount} stale alert(s) by system bot ID ${env.SYSTEM_BOT_DOCTOR_ID}`,
        )
    } catch (error) {
      console.error('[Cron Job] autoResolveStaleAlerts failed:', error)
    }
  })

  console.log(`[Cron Job] Stale alert auto-resolve scheduled (${expr})`)
}
