import type { PaginationParams } from '@/types/api.type'

export interface GetMyNotificationsParams extends PaginationParams {
  isRead?: boolean
}
