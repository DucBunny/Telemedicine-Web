import { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

import { fetchZegoKitToken } from '@/features/calls/lib/zego-config'

export interface ZegoPrebuiltCallProps {
  conversationId: string
  callLogId: number
  /** Tăng mỗi lần mở cuộc gọi mới — tránh joinRoom repeat (Strict Mode / đóng-mở nhanh). */
  mountVersion?: number
  onLeaveRoom?: (durationSeconds: number) => void
}

export function ZegoPrebuiltCall({
  conversationId,
  callLogId,
  mountVersion = 0,
  onLeaveRoom,
}: ZegoPrebuiltCallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const zpRef = useRef<InstanceType<typeof ZegoUIKitPrebuilt> | null>(null)
  const onLeaveRef = useRef(onLeaveRoom)
  onLeaveRef.current = onLeaveRoom
  const joinedAtMsRef = useRef<number>(0)
  /** Tăng ở cleanup: mọi async “cũ” phải thoát trước joinRoom (Strict Mode / đổi deps). */
  const effectEpochRef = useRef(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const runId = ++effectEpochRef.current

    setError(null)
    joinedAtMsRef.current = 0

    const prevZp = zpRef.current
    zpRef.current = null
    if (prevZp) {
      window.setTimeout(() => {
        try {
          prevZp.destroy()
        } catch {
          /* tránh createSpan / tracer lỗi khi hủy đồng bộ */
        }
      }, 0)
    }
    container.replaceChildren()

    void (async () => {
      let kitToken: string
      try {
        kitToken = await fetchZegoKitToken(conversationId, callLogId)
      } catch (e) {
        if (runId !== effectEpochRef.current) return
        const hint =
          e instanceof Error
            ? e.message
            : 'Không lấy được token video. Kiểm tra ZEGO_APP_ID / ZEGO_SERVER_SECRET trên server, và người nhận phải chấp nhận cuộc gọi trước khi vào phòng.'
        setError(hint)
        return
      }

      if (runId !== effectEpochRef.current) return

      joinedAtMsRef.current = Date.now()

      const zp = ZegoUIKitPrebuilt.create(kitToken)
      zpRef.current = zp
      zp.joinRoom({
        container,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
          config: { role: ZegoUIKitPrebuilt.Host },
        },
        showPreJoinView: false,
        showTextChat: false,
        showUserList: false,
        layout: 'Auto',
        turnOnCameraWhenJoining: true,
        turnOnMicrophoneWhenJoining: true,
        onLeaveRoom: () => {
          const start = joinedAtMsRef.current
          const durationSeconds =
            start > 0 ? Math.max(0, Math.floor((Date.now() - start) / 1000)) : 0
          onLeaveRef.current?.(durationSeconds)
        },
      })
    })()

    return () => {
      effectEpochRef.current++
      const zpToDestroy = zpRef.current
      zpRef.current = null
      const containerEl = container
      window.setTimeout(() => {
        try {
          zpToDestroy?.destroy()
        } catch {
          /* ignore */
        }
        try {
          containerEl.replaceChildren()
        } catch {
          /* ignore */
        }
      }, 0)
    }
  }, [conversationId, callLogId, mountVersion])

  if (error) {
    return (
      <div className="relative box-border h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="zego-prebuilt-host pointer-events-none invisible absolute inset-0 box-border overflow-hidden bg-black"
          aria-hidden
        />
        <div className="text-destructive absolute inset-0 z-10 box-border flex h-full min-h-0 w-full items-center justify-center bg-black/80 p-6 text-center text-sm">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="zego-prebuilt-host box-border h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden bg-black [&_canvas]:h-full! [&_canvas]:max-h-none! [&_canvas]:w-full! [&_video]:h-full! [&_video]:max-h-none! [&_video]:w-full! [&_video]:object-cover"
    />
  )
}
