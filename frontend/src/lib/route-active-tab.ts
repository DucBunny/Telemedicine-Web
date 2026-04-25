/**
 * Determines the active tab based on the current pathname
 * @param pathname - The current location pathname
 * @returns The active tab id
 * @example
 * routeToActiveTab('/patient/appointments') // returns 'appointments'
 * routeToActiveTab('/doctor/patients') // returns 'patients'
 */
export const routeToActiveTab = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(Boolean) // Split and remove empty segments

  if (!pathSegments[1]) return 'dashboard' // Default to dashboard if no second segment

  return pathSegments[1]
}
