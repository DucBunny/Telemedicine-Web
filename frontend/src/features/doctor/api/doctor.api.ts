import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import { apiClient } from '@/lib/axios'

const DOCTOR_BASE = '/doctors'

export interface Doctor {
  id: number
  userId: number
  specialty: string
  licenseNumber: string
  yearsOfExperience: number
  bio: string
  User: {
    id: number
    fullName: string
    email: string
    phoneNumber: string
    role: string
  }
}

export interface DoctorPatient {
  id: number
  userId: number
  dateOfBirth: string
  gender: string
  bloodType: string
  height: number
  weight: number
  User: {
    id: number
    fullName: string
    email: string
    phoneNumber: string
  }
}

export const doctorApi = {
  /**
   * Get all doctors with pagination
   */
  getAll: async (params: PaginationParams & { search?: string }) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Doctor>>(
      DOCTOR_BASE,
      { params },
    )
    return data
  },

  /**
   * Get doctor by ID
   */
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Doctor>>(
      `${DOCTOR_BASE}/${id}`,
    )
    return data.data
  },

  /**
   * Get current doctor profile
   */
  getMyProfile: async () => {
    const { data } = await apiClient.get<ApiSuccessResponse<Doctor>>(
      `${DOCTOR_BASE}/me/profile`,
    )
    return data.data
  },

  /**
   * Get doctor's patients
   */
  getDoctorPatients: async (id: number, params: PaginationParams) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<DoctorPatient>>(
      `${DOCTOR_BASE}/${id}/patients`,
      { params },
    )
    return data
  },

  /**
   * Get my patients (for logged in doctor)
   */
  getMyPatients: async (params: PaginationParams) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<DoctorPatient>>(
      `${DOCTOR_BASE}/me/patients`,
      { params },
    )
    return data
  },

  /**
   * Create new doctor
   */
  create: async (payload: Partial<Doctor>) => {
    const { data } = await apiClient.post<ApiSuccessResponse<Doctor>>(
      DOCTOR_BASE,
      payload,
    )
    return data.data
  },

  /**
   * Update doctor
   */
  update: async (id: number, payload: Partial<Doctor>) => {
    const { data } = await apiClient.put<ApiSuccessResponse<Doctor>>(
      `${DOCTOR_BASE}/${id}`,
      payload,
    )
    return data.data
  },

  /**
   * Delete doctor
   */
  delete: async (id: number) => {
    const { data } = await apiClient.delete<
      ApiSuccessResponse<{ message: string }>
    >(`${DOCTOR_BASE}/${id}`)
    return data.data
  },
}
