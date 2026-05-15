import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api.type'

import { callApi } from '@/features/calls/api/call.api'
import { getErrorMessage } from '@/lib/axios'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function isCallNotAcceptedError(error: unknown): boolean {
  const code = (error as AxiosError<ApiErrorResponse>).response?.data.error.code
  return code === 'CALL_NOT_ACCEPTED'
}

/**
 * Lấy token04 từ API rồi tạo Kit Token trên trình duyệt.
 * Retry ngắn khi receiver vừa accept (tránh race với socket).
 * Throw error nếu không lấy được token sau 6 lần retry.
 */
export async function fetchZegoKitToken(
  conversationId: string,
  callLogId: number,
): Promise<string> {
  const maxAttempts = 6
  let lastError: unknown

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await callApi.getZegoKitToken(conversationId, callLogId)
      const { appId, token, roomId, userId, userName } = res

      return ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appId,
        token,
        roomId,
        userId,
        userName,
      )
    } catch (e) {
      lastError = e
      if (attempt < maxAttempts - 1 && isCallNotAcceptedError(e)) {
        await sleep(400)
        continue
      }
      throw new Error(getErrorMessage(e))
    }
  }

  throw new Error(getErrorMessage(lastError))
}
