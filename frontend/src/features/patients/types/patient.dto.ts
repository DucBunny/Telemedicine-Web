import type { BloodTypeOption, GenderOption } from '@/features/patients/types'
import type { PaginationParams } from '@/types/api.type'

export interface GetMyPatientsParams extends PaginationParams {
  search?: string
  bloodType?: BloodTypeOption
  gender?: GenderOption
  dobFrom?: string
  dobTo?: string
}
