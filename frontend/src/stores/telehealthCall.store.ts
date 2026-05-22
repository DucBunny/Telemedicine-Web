import { create } from 'zustand'

import type { Alert } from '@/features/alerts/types'
import type { Appointment } from '@/features/appointments/types'

interface TelehealthCallStore {
  /**
   * Chờ consume khi mở chat với ?startVideo (chỉ trình duyệt caller)
   */
  pendingAppointmentForCall: Appointment | null

  /**
   * Panel visit trên trình duyệt hiện tại (caller và receiver đều có)
   */
  activeVisitAppointment: Appointment | null

  /** Chờ consume khi mở chat từ cảnh báo sức khỏe */
  pendingAlertForCall: Alert | null

  /** Alert đầy đủ — bác sĩ (panel bệnh án / chốt ca) */
  activeAlertForVisit: Alert | null

  /** Cờ nhẹ — bệnh nhân (panel text tĩnh, set từ socket fromAlert) */
  activeVisitFromAlert: boolean

  setPendingAppointmentForCall: (appointment: Appointment | null) => void
  setActiveVisitAppointment: (appointment: Appointment | null) => void
  setPendingAlertForCall: (alert: Alert | null) => void
  setActiveAlertForVisit: (alert: Alert | null) => void
  setActiveVisitFromAlert: (fromAlert: boolean) => void
}

/**
 * Zustand store để quản lý trạng thái cuộc gọi - Caller
 * - pendingAppointmentForCall: Chờ consume khi mở chat với ?startVideo - từ bảng lịch.
 * - activeVisitAppointment: Gắn với cuộc gọi đang mở - hiện panel visit.
 *
 * Còn Receiver dùng socket: set sau khi accept + GET /me/appointments/:id (appointmentId từ socket). (không dùng store này)
 */
export const useTelehealthCallStore = create<TelehealthCallStore>((set) => ({
  pendingAppointmentForCall: null,
  activeVisitAppointment: null,
  pendingAlertForCall: null,
  activeAlertForVisit: null,
  activeVisitFromAlert: false,

  setPendingAppointmentForCall: (appointment) =>
    set({ pendingAppointmentForCall: appointment }),

  setActiveVisitAppointment: (appointment) =>
    set({ activeVisitAppointment: appointment }),

  setPendingAlertForCall: (alert) => set({ pendingAlertForCall: alert }),

  setActiveAlertForVisit: (alert) => set({ activeAlertForVisit: alert }),

  setActiveVisitFromAlert: (fromAlert) => set({ activeVisitFromAlert: fromAlert }),
}))
