import { z } from 'zod'

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
})
