/**
 * Format a date string to a more readable format in Vietnamese locale.
 * @param dateStr
 * @returns Formatted date string in Vietnamese locale (e.g., "Thứ Hai, 01/01/2024")
 */
export function formatLongDate(dateStr: string) {
  return new Date(dateStr.split(' ')[0]).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Format a date string to short date in Vietnamese locale.
 * @param dateStr
 * @returns Formatted date string in Vietnamese locale (e.g., "01/01/2024")
 */
export function formatShortDate(dateStr: string) {
  return new Date(dateStr.split(' ')[0]).toLocaleDateString('vi-VN')
}

/**
 * Format a time string to a more readable format in Vietnamese locale.
 * @param dateStr
 * @returns Formatted time string in Vietnamese locale (e.g., "08:30")
 */
export function formatTime(dateStr: string) {
  const timePart = dateStr.split(' ')[1]
  return new Date(`1970-01-01T${timePart}`).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
