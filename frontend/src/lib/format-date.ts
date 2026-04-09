import {
  differenceInYears,
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
} from 'date-fns'
import { vi } from 'date-fns/locale'

/**
 * Parses a date string or Date object into a Date object.
 */
const parseDateInput = (value: string | Date) => {
  if (value instanceof Date) return value

  const raw = value.trim()
  if (!raw) return new Date(NaN)

  // Handle "YYYY-MM-DD HH:mm:ss" format as UTC
  // E.g: From "2026-04-06 09:00:00" => Mon Apr 06 2026 09:00:00 GMT+0700 (Indochina Time)
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(raw))
    return parseISO(raw.replace(' ', 'T') + 'Z')

  // Handle "YYYY-MM-DD" format as UTC midnight
  // E.g: From "2026-04-06" => Mon Apr 06 2026 00:00:00 GMT+0700 (Indochina Time)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return parseISO(`${raw}T00:00:00Z`)

  // Try parsing as ISO format first, then fallback to Date constructor
  const parsed = parseISO(raw)
  if (isValid(parsed)) return parsed

  return new Date(raw)
}

/**
 * @param date
 * @returns (e.g., "Thứ Hai, 01/01/2024")
 * @example formatLongDate('2024-01-01') => "Thứ Hai, 01/01/2024"
 * @example formatLongDate('2024-01-01T10:30:00') => "Thứ Hai, 01/01/2024"
 */
export function formatLongDate(date: string | Date) {
  return format(parseDateInput(date), 'cccc, dd/MM/yyyy', {
    locale: vi,
  })
}

/**
 * @param date
 * @returns (e.g., "01/01/2024")
 * @example formatShortDate('2024-01-01') => "01/01/2024"
 */
export function formatShortDate(date: string | Date) {
  return format(parseDateInput(date), 'P', {
    locale: vi,
  })
}

/**
 * @param date
 * @returns (e.g., "08:30")
 * @example formatTime('2024-01-01T08:30:00') => "08:30"
 * @example formatTime('2024-01-01') => "00:00"
 */
export function formatTime(date: string | Date) {
  return format(parseDateInput(date), 'p', {
    locale: vi,
  })
}

/**
 * Calculate age from a birth date string.
 * @param birthDateValue
 * @returns Age in years (e.g., 30)
 * @example calculateAge('1990-01-01') => 34 (as of 1/1/2024)
 * @example calculateAge(('1990-01-02')) => 33 (as of 1/1/2024) because the birthday hasn't occurred yet in the current year.
 * @example calculateAge(new Date('1990-01-02')) => 34 (as of 2/1/2024)
 */
export function calculateAge(birthDateValue: string | Date) {
  return differenceInYears(parseDateInput(birthDateValue), new Date())
}

/**
 * Format a date to YYYY-MM-DD format for API
 * @param date
 * @returns Formatted date string in YYYY-MM-DD format (e.g., "2024-01-01")
 * @example formatDateForApi('2024-01-01T10:30:00') => "2024-01-01"
 * @example formatDateForApi('2024-01-01') => "2024-01-01"
 */
export function formatDateForApi(date: Date | string) {
  return format(parseDateInput(date), 'yyyy-MM-dd')
}

/**
 * Format distance to now in Vietnamese locale.
 * @param date
 * @returns Formatted distance to now in Vietnamese locale (e.g., "2 phút trước")
 * @example formatDistanceToNowVN('2024-01-01T10:30:00') => "x tháng trước" (as of 2024-06)
 */
export function formatDistanceToNowVN(date: Date | string) {
  return formatDistanceToNow(parseDateInput(date), {
    includeSeconds: true,
    addSuffix: true,
    locale: vi,
  })
}

/**
 * Converts a date and time in Vietnam local time to UTC ISO string.
 * @param date
 * @param time
 * @returns UTC ISO string
 * @example toUtcIsoFromVietnamLocal('2024-01-01', '10:30:00') => "2024-01-01T03:30:00.000Z"
 * @example toUtcIsoFromVietnamLocal('2024-01-01', '00:00:00') => "2023-12-31T17:00:00.000Z"
 * Note: Vietnam is UTC+7, so we subtract 7 hours to convert to UTC.
 */
export function toUtcIsoFromVietnamLocal(date: string, time: string) {
  const localDateTime = new Date(`${date}T${time}:00`)
  return localDateTime.toISOString()
}

/**
 * Format a date to "MMMM yyyy" format in Vietnamese locale.
 * @param date
 * @returns Formatted month and year string in Vietnamese locale (e.g., "Tháng 1 2024")
 * @example formatMonthYearVN('2024-01-01') => "Tháng 1 2024"
 * @example formatMonthYearVN('2024-01-01T10:30:00') => "Tháng 1 2024"
 */
export function formatMonthYearVN(date: string | Date) {
  return format(parseDateInput(date), 'MMMM yyyy', {
    locale: vi,
  })
}
