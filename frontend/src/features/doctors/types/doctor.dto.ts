import type { PaginationParams } from '@/types/api.type'

export interface GetAllDoctorsParams extends PaginationParams {
  search?: string
  specialtyId?: number | null
}
