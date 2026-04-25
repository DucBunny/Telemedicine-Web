import { useQuery } from '@tanstack/react-query'
import { deviceApi } from '../api/device.api'
import type { PaginationParams } from '@/types/api.type'

const DEVICE_KEYS = {
  all: ['admin'] as const,
  devices: () => [...DEVICE_KEYS.all, 'devices'] as const,
  devicesList: (params: PaginationParams & { status?: string }) =>
    [...DEVICE_KEYS.devices(), 'list', params] as const,
  deviceDetail: (id: number) =>
    [...DEVICE_KEYS.devices(), 'detail', id] as const,
  recentDevices: (limit: number) =>
    [...DEVICE_KEYS.devices(), 'recent', limit] as const,
}

/**
 * Hook to get all devices with pagination
 */
export const useGetAllDevices = (
  params: PaginationParams & { status?: string },
) => {
  return useQuery({
    queryKey: DEVICE_KEYS.devicesList(params),
    queryFn: () => deviceApi.getAllDevices(params),
  })
}
