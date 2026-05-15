import { create } from 'zustand'

import type { Appointment } from '@/features/appointments/types'

interface TelehealthCallStore {
  /**
   * Chờ consume khi mở chat với ?startVideo (chỉ trình duyệt caller)
   */
  pendingAppointmentForCall: Appointment | null

  /**
   * Panel visit trên trình duyệt hiện tại (chỉ trình duyệt caller)
   */
  activeVisitAppointment: Appointment | null

  setPendingAppointmentForCall: (appointment: Appointment | null) => void
  setActiveVisitAppointment: (appointment: Appointment | null) => void
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

  setPendingAppointmentForCall: (appointment) =>
    set({ pendingAppointmentForCall: appointment }),

  setActiveVisitAppointment: (appointment) =>
    set({ activeVisitAppointment: appointment }),
}))
