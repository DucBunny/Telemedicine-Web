import { useMemo } from 'react'

import type { Appointment } from '@/features/appointments/types'
import type { UserRole } from '@/features/auth/types/auth.types'
import type { MedicalRecord } from '@/features/medicalRecords/types'

import { useGetRecordsByPatientIdAndCurrentDoctor } from '@/features/medicalRecords/hooks/useRecordQueries'

/**
 * Panel visit trong cuộc gọi — chỉ khi có appointment cụ thể
 */
export function useTelehealthAppointmentPanels(options: {
  appointment: Appointment | null | undefined
  peerUserId: number | undefined
  role: UserRole | undefined
  /** Bật khi đang mở dialog video và cần panel */
  enabled: boolean
}): {
  appointment: Appointment | null
  existingRecord: MedicalRecord | undefined
  isLoading: boolean
} {
  const appt = options.appointment ?? null
  const peerId = options.peerUserId ?? 0
  const run =
    options.enabled && !!appt && peerId > 0 && options.role === 'doctor'

  const records = useGetRecordsByPatientIdAndCurrentDoctor(
    options.role === 'doctor' ? peerId : 0,
    { page: 1, limit: 50 },
    { enabled: run },
  )

  const existingRecord = useMemo(() => {
    if (!appt) return undefined
    const list = records.data?.data
    if (!list) return undefined
    return list.find((r) => r.appointmentId === appt.id)
  }, [appt, records.data?.data])

  const isLoading = !!appt && options.role === 'doctor' && records.isLoading

  return { appointment: appt, existingRecord, isLoading }
}
