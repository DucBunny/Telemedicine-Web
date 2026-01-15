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
 * Hook to get current patient profile
 */
export const useGetPatientProfile = () => {
  return useQuery({
    queryKey: PATIENT_KEYS.myProfile(),
    queryFn: () => patientApi.getProfile(),
  })
}

/**
 * Hook to get all patients with pagination
//  */
// export const useGetPatients = (
//   params: PaginationParams & { search?: string },
// ) => {
//   return useQuery({
//     queryKey: PATIENT_KEYS.list(params),
//     queryFn: () => patientApi.getAll(params),
//   })
// }

// /**
//  * Hook to get patient by ID
//  */
// export const useGetPatientById = (id: number) => {
//   return useQuery({
//     queryKey: PATIENT_KEYS.detail(id),
//     queryFn: () => patientApi.getById(id),
//     enabled: !!id,
//   })
// }

// /**
//  * Hook to create a new patient
//  */
// export const useCreatePatient = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: patientApi.create,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() })
//     },
//   })
// }

// /**
//  * Hook to update a patient
//  */
// export const useUpdatePatient = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: ({ id, payload }: { id: number; payload: any }) =>
//       patientApi.update(id, payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() })
//       queryClient.invalidateQueries({
//         queryKey: PATIENT_KEYS.detail(variables.id),
//       })
//       queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.myProfile() })
//     },
//   })
// }

// /**
//  * Hook to delete a patient
//  */
// export const useDeletePatient = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: patientApi.delete,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() })
//     },
//   })
// }
