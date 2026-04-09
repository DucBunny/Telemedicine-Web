import type { ApiSuccessResponse } from '@/types/api.type'
import { apiClient } from '@/lib/axios'

export interface UploadResult {
  url: string
  public_id: string
  original_name: string
  format: string
  resource_type: string
  size: number
  width: number | null
  height: number | null
}

export const uploadApi = {
  /**
   * Upload avatar image - tự động cập nhật vào DB và xóa avatar cũ
   */
  uploadAvatar: async (file: File): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await apiClient.put<ApiSuccessResponse<UploadResult>>(
      '/uploads/avatar',
      formData,
      {
        headers: {
          'Content-Type': undefined, // Để axios tự set multipart/form-data với boundary
        },
      },
    )

    return data.data
  },

  /**
   * Upload general image
   */
  uploadImage: async (
    file: File,
    options?: { moduleName?: string },
  ): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)
    if (options?.moduleName) {
      formData.append('moduleName', options.moduleName)
    }

    const { data } = await apiClient.post<ApiSuccessResponse<UploadResult>>(
      '/uploads/image',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      },
    )

    return data.data
  },

  /**
   * Upload document file
   */
  uploadDocument: async (
    file: File,
    options?: { moduleName?: string },
  ): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)
    if (options?.moduleName) {
      formData.append('moduleName', options.moduleName)
    }

    const { data } = await apiClient.post<ApiSuccessResponse<UploadResult>>(
      '/uploads/document',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      },
    )

    return data.data
  },
}
