import type { ApiSuccessResponse } from '@/types/api.type'

import { apiClient } from '@/lib/axios'

const CALL_BASE = '/calls'

export const callApi = {
  /**
   * Bắt đầu cuộc gọi — server tạo call_logs, trả callLogId.
   */
  startVideoCall: async (conversationId: string) => {
    const { data } = await apiClient.post<
      ApiSuccessResponse<{ callLogId: number }>
    >(`${CALL_BASE}/conversations/${conversationId}/calls`)
    return data.data
  },

  /** Người nhận chấp nhận — cập nhật DB trước khi lấy zego-kit-token */
  acceptCall: async (conversationId: string, callLogId: number) => {
    const { data } = await apiClient.post<
      ApiSuccessResponse<{ callLogId: number }>
    >(
      `${CALL_BASE}/conversations/${conversationId}/calls/${callLogId}/accept`,
    )
    return data.data
  },

  /**
   * ZEGOCLOUD: token04 từ server + metadata → client dùng generateKitTokenForProduction
   */
  getZegoKitToken: async (conversationId: string, callLogId: number) => {
    const { data } = await apiClient.get<
      ApiSuccessResponse<{
        appId: number
        token: string
        roomId: string
        userId: string
        userName: string
        callLogId: number
      }>
    >(`${CALL_BASE}/conversations/${conversationId}/zego-kit-token`, {
      params: { callLogId },
    })
    return data.data
  },
}
