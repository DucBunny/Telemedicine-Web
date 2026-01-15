import type { UserRole } from './types/auth.types'

export const roleToPath: Record<UserRole, string> = {
  admin: '/admin',
  doctor: '/doctor',
  patient: '/patient',
}

export const PUBLIC_ROUTES = ['/login', '/register', '/', '/unauthorized']
