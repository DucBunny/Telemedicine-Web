import {
  differenceInCalendarDays,
  differenceInYears,
  format,
  formatDistanceToNow,
  isThisISOWeek,
  isThisYear,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  parseISO,
} from 'date-fns'
import { vi } from 'date-fns/locale'

import type { DateRange } from 'react-day-picker'

/**
 * Parses a date string or Date object into a Date object.
 */
export const parseDateInput = (value: string | Date) => {
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
  return differenceInYears(new Date(), parseDateInput(birthDateValue))
}

/**
 * Format a date to YYYY-MM-DD format for API
 * @param date
 * @returns Formatted date string in YYYY-MM-DD format (e.g., "2024-01-01")
 * @example formatDateForApi('2024-01-01T10:30:00') => "2024-01-01"
 * @example formatDateForApi('2024-01-01') => "2024-01-01"
 */
export function formatDateForApi(date: string | Date) {
  return format(parseDateInput(date), 'yyyy-MM-dd')
}

/**
 * Format distance to now with seconds in Vietnamese locale.
 * @param date
 * @returns Formatted distance to now with seconds in Vietnamese locale (e.g., "2 phút trước")
 * @example formatDistanceToNowWithSeconds('2024-01-01T10:30:00') => "x phút trước" (as of 2024-06)
 */
export function formatDistanceToNowWithSeconds(date: string | Date) {
  return formatDistanceToNow(parseDateInput(date), {
    includeSeconds: true,
    addSuffix: false,
    locale: vi,
  })
}

/**
 * Format date to now in Vietnamese locale.
 * @param date
 * @returns Formatted date to now in Vietnamese locale (e.g., "Hôm nay", "Ngày mai", "Hôm qua", "x ngày nữa", "x ngày trước", "dd/MM/yyyy")
 * @example formatRelativeDate('2026-04-17T10:30:00') => "Hôm nay" (as of 2026-04-17)
 */
export function formatRelativeDate(date: string | Date) {
  const dateInput = parseDateInput(date)
  const now = new Date()

  if (isToday(dateInput)) return 'Hôm nay'
  if (isTomorrow(dateInput)) return 'Ngày mai'
  if (isYesterday(dateInput)) return 'Hôm qua'

  const diffDays = differenceInCalendarDays(dateInput, now)
  if (diffDays > 0 && diffDays <= 7) return `${diffDays} ngày nữa`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} ngày trước`

  return format(dateInput, 'dd/MM/yyyy')
}

/**
 * Converts a date and time in Vietnam local time to UTC ISO string.
 * @param date
 * @param time
 * @returns UTC ISO string
 * @example toUtcIsoFromVietnamLocal('2024-01-01', '10:30') => "2024-01-01T03:30:00.000Z"
 * @example toUtcIsoFromVietnamLocal('2024-01-01', '00:00') => "2023-12-31T17:00:00.000Z"
 * Note: Vietnam is UTC+7, so we subtract 7 hours to convert to UTC.
 */
export function toUtcIsoFromVietnamLocal(date: string | Date, time: string) {
  const dateInput = parseDateInput(date)
  const [hours, minutes] = time.split(':').map(Number)
  dateInput.setHours(hours, minutes, 0, 0)

  return dateInput.toISOString()
}

/**
 * Get today's UTC ISO range in Vietnam local time.
 * @returns Today's UTC ISO range in Vietnam local time (e.g., "2024-01-01T00:00:00.000Z" - "2024-01-01T23:59:59.999Z")
 * @example getVietnamTodayUtcRange() => { scheduledFrom: "2024-01-01T00:00:00.000Z", scheduledTo: "2024-01-01T23:59:59.999Z" }
 */
export function getVietnamTodayUtcRange() {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date())

  return {
    scheduledFrom: toUtcIsoFromVietnamLocal(today, '00:00'),
    scheduledTo: toUtcIsoFromVietnamLocal(today, '23:59'),
  }
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

/**
 * Format a date range to a label string.
 * @param range - The date range to format
 * @param emptyLabel - The label to show when the date range is empty
 * @returns The formatted date range label
 */
export function formatDateRangeLabel(
  range: DateRange | undefined,
  emptyLabel: string,
) {
  if (!range?.from && !range?.to) return emptyLabel

  return `${formatShortDate(range.from || '')} - ${formatShortDate(range.to || '')}`
}

/**
 * Format a date for chat in Vietnamese locale.
 * @param date
 * @returns Formatted date for chat in Vietnamese locale (e.g., "HH:mm" if today, "dd/MM" if not today)
 * @example formatDateForChat('2024-01-01T10:30:00') => "10:30" (as of 2024-01-01)
 * @example formatDateForChat('2024-01-01') => "Thứ Hai" (as of 2024-01-02)
 * @example formatDateForChat('2024-01-01') => "01/01" (as of 2024-02-01)
 * @example formatDateForChat('2024-01-01') => "01/01/2024" (as of 2025-01-01)
 */
export function formatDateForChat(date: string | Date) {
  if (isToday(parseDateInput(date)))
    return format(parseDateInput(date), 'HH:mm', {
      locale: vi,
    })

  if (isThisISOWeek(parseDateInput(date)))
    return format(parseDateInput(date), 'EEEEEE', {
      locale: vi,
    })

  if (isThisYear(parseDateInput(date)))
    return format(parseDateInput(date), 'dd/MM', {
      locale: vi,
    })

  return format(parseDateInput(date), 'dd/MM/yyyy', {
    locale: vi,
  })
}
