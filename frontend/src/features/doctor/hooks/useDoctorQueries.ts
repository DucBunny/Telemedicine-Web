import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '../api/doctor.api'
import type { PaginationParams } from '@/types/api.type'

const DOCTOR_KEYS = {
  all: ['doctors'] as const,
  lists: () => [...DOCTOR_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { search?: string }) =>
    [...DOCTOR_KEYS.lists(), params] as const,
  details: () => [...DOCTOR_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...DOCTOR_KEYS.details(), id] as const,
  myProfile: () => [...DOCTOR_KEYS.all, 'my-profile'] as const,
  myPatients: (params: PaginationParams) =>
    [...DOCTOR_KEYS.all, 'my-patients', params] as const,
  doctorPatients: (id: number, params: PaginationParams) =>
    [...DOCTOR_KEYS.all, 'doctor-patients', id, params] as const,
}

/**
 * Hook to get current doctor profile
 */
export const useGetDoctorProfile = () => {
  return useQuery({
    queryKey: DOCTOR_KEYS.myProfile(),
    queryFn: () => doctorApi.getProfile(),
  })
}

// /**
//  * Hook to get all doctors with pagination
//  */
// export const useGetDoctors = (
//   params: PaginationParams & { search?: string },
// ) => {
//   return useQuery({
//     queryKey: DOCTOR_KEYS.list(params),
//     queryFn: () => doctorApi.getAll(params),
//   })
// }

// /**
//  * Hook to get doctor by ID
//  */
// export const useGetDoctorById = (id: number) => {
//   return useQuery({
//     queryKey: DOCTOR_KEYS.detail(id),
//     queryFn: () => doctorApi.getById(id),
//     enabled: !!id,
//   })
// }

// /**
//  * Hook to get my patients (for logged in doctor)
//  */
// export const useGetMyPatients = (params: PaginationParams) => {
//   return useQuery({
//     queryKey: DOCTOR_KEYS.myPatients(params),
//     queryFn: () => doctorApi.getMyPatients(params),
//   })
// }

// /**
//  * Hook to get doctor's patients
//  */
// export const useGetDoctorPatients = (id: number, params: PaginationParams) => {
//   return useQuery({
//     queryKey: DOCTOR_KEYS.doctorPatients(id, params),
//     queryFn: () => doctorApi.getDoctorPatients(id, params),
//     enabled: !!id,
//   })
// }

// /**
//  * Hook to create a new doctor
//  */
// export const useCreateDoctor = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: doctorApi.create,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() })
//     },
//   })
// }

// /**
//  * Hook to update a doctor
//  */
// export const useUpdateDoctor = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: ({ id, payload }: { id: number; payload: any }) =>
//       doctorApi.update(id, payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() })
//       queryClient.invalidateQueries({
//         queryKey: DOCTOR_KEYS.detail(variables.id),
//       })
//       queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.myProfile() })
//     },
//   })
// }

// /**
//  * Hook to delete a doctor
//  */
// export const useDeleteDoctor = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: doctorApi.delete,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() })
//     },
//   })
// }
