/**
 * Normalize a query param that may be provided as
 * - an array (e.g. status[]=a&status[]=b)
 * - a CSV string (status=a,b)
 * - a single string (status=a)
 * Returns an array of trimmed, non-empty strings.
 */
export const normalizeQueryArray = (raw) => {
  if (Array.isArray(raw)) return raw.slice()
  if (typeof raw === 'string')
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  return []
}
