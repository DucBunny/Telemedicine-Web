import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patientApi } from '../api/patient.api'
import type { PaginationParams } from '@/types/api.type'

const PATIENT_KEYS = {
  all: ['patients'] as const,
  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { search?: string }) =>
    [...PATIENT_KEYS.lists(), params] as const,
  details: () => [...PATIENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PATIENT_KEYS.details(), id] as const,
  myProfile: () => [...PATIENT_KEYS.all, 'my-profile'] as const,
  myDevices: () => [...PATIENT_KEYS.all, 'my-devices'] as const,
  patientDevices: (id: number) =>
    [...PATIENT_KEYS.all, 'patient-devices', id] as const,
}

/**
 * Hook to get my devices (for logged in patient)
//  */
// export const useGetMyDevices = () => {
//   return useQuery({
//     queryKey: PATIENT_KEYS.myDevices(),
//     queryFn: () => patientApi.getMyDevices(),
//   })
// }

// /**
//  * Hook to get patient's devices
//  */
// export const useGetPatientDevices = (id: number) => {
//   return useQuery({
//     queryKey: PATIENT_KEYS.patientDevices(id),
//     queryFn: () => patientApi.getPatientDevices(id),
//     enabled: !!id,
//   })
// }
