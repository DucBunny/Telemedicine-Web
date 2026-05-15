import { appointmentApi } from '@/features/appointments/api/appointment.api'
import { useTelehealthCallStore } from '@/stores/telehealthCall.store'

/**
 * Tải lịch từ API và gán vào store local (dùng cho receiver)
 */
export async function loadVisitAppointmentForCall(appointmentId: number) {
  const appointment = await appointmentApi.getMyAppointmentById(appointmentId)
  useTelehealthCallStore.getState().setActiveVisitAppointment(appointment)
  return appointment
}
