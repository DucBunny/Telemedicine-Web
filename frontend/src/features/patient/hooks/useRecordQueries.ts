import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateRecordBody,
  GetMyRecordsParams,
  UpdateRecordBody,
} from '@/features/patient/dto/record.dto'
import { recordApi } from '@/features/patient/api/record.api'
import { getErrorMessage } from '@/lib/axios'

export const RECORD_KEYS = {
  all: ['records'] as const,

  lists: () => [...RECORD_KEYS.all, 'list'] as const,
  list: (params?: GetMyRecordsParams) =>
    [...RECORD_KEYS.lists(), params] as const,

  details: () => [...RECORD_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...RECORD_KEYS.details(), id] as const,
}

/**
 * Hook to get the current patient's own medical records
 */
export const useGetMyRecords = (params: GetMyRecordsParams) => {
  return useQuery({
    queryKey: RECORD_KEYS.list(params),
    queryFn: () => recordApi.getMyRecords(params),
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook to get a medical record by ID
 */
export const useGetRecordById = (id: number) => {
  return useQuery({
    queryKey: RECORD_KEYS.detail(id),
    queryFn: () => recordApi.getRecordById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a medical record (doctor only)
 */
export const useCreateRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRecordBody) => recordApi.createRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORD_KEYS.lists() })
      toast.success('Tạo hồ sơ thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Tạo hồ sơ thất bại')
    },
    retry: false,
  })
}

/**
 * Hook to update a medical record (doctor only)
 */
export const useUpdateRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRecordBody }) =>
      recordApi.updateRecord(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: RECORD_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: RECORD_KEYS.detail(id) })
      toast.success('Cập nhật hồ sơ thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Cập nhật hồ sơ thất bại')
    },
    retry: false,
  })
}

/**
 * Hook to delete a medical record (admin only)
 */
export const useDeleteRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => recordApi.deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORD_KEYS.lists() })
      toast.success('Xoá hồ sơ thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Xoá hồ sơ thất bại')
    },
    retry: false,
  })
}
