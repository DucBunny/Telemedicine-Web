import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'

import type { AppointmentType } from '@/features/appointments/types'

interface BookingAppointmentStore {
  specialtyId: number | null
  doctorId: number | null
  date: string | null
  time: string | null
  type: AppointmentType

  setSpecialtyId: (specialtyId: number | null) => void
  setDoctorId: (doctorId: number | null) => void
  setSchedule: (data: {
    date: string
    time: string
    type: AppointmentType
  }) => void
  resetForm: () => void
}

// Zustand store để quản lý state của form đặt lịch hẹn
export const useBookingAppointment = create<BookingAppointmentStore>()(
  persist(
    (set) => ({
      specialtyId: null,
      doctorId: null,
      date: null,
      time: null,
      type: 'offline',

      setSpecialtyId: (specialtyId) => set({ specialtyId }),
      setDoctorId: (doctorId) => set({ doctorId }),
      setSchedule: (data) => set({ ...data }),

      resetForm: () =>
        set({
          specialtyId: null,
          doctorId: null,
          date: null,
          time: null,
          type: 'offline',
        }),
    }),
    {
      name: 'booking-appointment-storage',
    },
  ),
)

// Custom hook để lấy toàn bộ giá trị form
export const useBookingFormValues = () =>
  useBookingAppointment(
    useShallow((state: BookingAppointmentStore) => ({
      doctorId: state.doctorId,
      date: state.date,
      time: state.time,
      type: state.type,
    })),
  )
